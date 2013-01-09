<?php
class Default_Model_ReconData extends Zend_Db_Table_Abstract
{
	protected $_name = 'recondata_reconciliationdata_tbl';


	/**
	 * this function calls a stored procedure which returns in a pivot array
	 */
	public function getDataPivot($id)
	{
		$db = $this->getAdapter();
		$stmt = $db->prepare("CALL usp_pivot_recon_data(?)");
		$stmt->bindValue(1, $id);
		//Zend_Registry::get('logdebug')->info("getPivotData for ID: {$id}");

		try {
			$stmt->execute();
		} catch (Exception $e) {
			Zend_Registry::get('logdebug')->info(print_r($e,true));
		}

		$data = $stmt->fetchAll();

		/*
		find num related files for recon_ID_int....
		find num photo files for recon_ID_int....
		*/

		$i = 1;
		$result = array();

		// $row -> {Label_char, ValueOne_char, ValueTwo_char, ValueThree_char, ValueFour_char, ValueFive_char}
		// $result -> {Label_char, ValueOne_char, ValueTwo_char, ValueThree_char, ValueFour_char, ValueFive_char, pk}
		foreach ($data as $row) {
			$row['pk'] = $i; // add PK
			$result[] = $row;
			$i++;
		}
		return $result;
	}

	public function updatePivotData($data, $id)
	{
		$db = $this->getAdapter();
		Zend_Registry::get('logsql')->info("SAVED: {$id}: Vendor:" . $data['recondata_Vendor_char']);
		$this->update($data, $db->quoteInto('recondata_ID_int = ?', $id));
	}

	public function getOrderData($reconId)
	{
		$db = $this->getAdapter();

		$sql = "SELECT * FROM recon_reconciliationorder_tbl WHERE recon_ID_int = ?";
		$stmt = $db->prepare($sql);
		$stmt->bindValue(1, $reconId);
		$stmt->execute();

		return $stmt->fetch(PDO::FETCH_ASSOC);
	}


	/**
	 * Get RMV Data
	 *
	 * Primarily used by RMV PDF
	 *
	 * @param int $orderId
	 * @return array
	 */
	public function getRmvData($orderId)
	{
		$orderId = intval($orderId);
		
		$sql = "CALL reconcil.usp_get_rmvdata(?)";
		$db = $this->getAdapter();
		$stmt = $db->prepare($sql);
		$stmt->execute(array($orderId));
		$rmvData = $stmt->fetch(PDO::FETCH_ASSOC);
		$stmt->closeCursor();

		// Quit here if we don't have a order to work with
		if (!is_array($rmvData) || count($rmvData) === 0) {
			return array();
		}

		// Normalize comps data
		$comps = array(
		   'comp1' => array(),
		   'comp2' => array(),
		   'comp3' => array()
		);
		if (is_array($rmvData)) {
			foreach($rmvData as $columnName => $value) {
				if (preg_match('/comp[123]/', $columnName)) {
					$comps[substr($columnName, 0, 5)][substr($columnName, 5)] = $value;
				}
			}
		}

		// Get Adjustments
		$adjustments = $this->getAdapter()->fetchAll(
			"CALL usp_get_rmvadjustments({$rmvData['reconId']})",
			Zend_Db::FETCH_ASSOC
		);

		$compAdjs = array(
			1 => 1,
			2 => 1,
			3 => 1
		);

		$comps['comp1']['adj'] = array();
		$comps['comp2']['adj'] = array();
		$comps['comp3']['adj'] = array();

		foreach($adjustments as $adj) {
			$compNum    = (int) $adj['CompNumber_int'];
			$comps["comp" . $compNum]['adj'][$adj['AdjustmentLabel_char']] = $adj['totaladj'];
		}


		foreach ($comps as $name => $c) {
			$concat = array();
			if ($c['Address']) { $concat[] = $c['Address']; }
			if ($c['Address']) { $concat[] = $c['Address']; }
			if ($c['Address']) { $concat[] = $c['Address']; }
			if ($c['Address']) { $concat[] = $c['Address']; }
			if ($c['Address']) { $concat[] = $c['Address']; }
			if ($c['Address']) { $concat[] = $c['Address']; }
			if ($c['Address']) { $concat[] = $c['Address']; }
			if ($c['Address']) { $concat[] = $c['Address']; }
		}

		// Assessment String
		$assessment = array();
		if ($rmvData['reconrmvassmt_compdst']){
			$assessment[] = 'Comp distance';
		}
		if ($rmvData['reconrmvassmt_inapprrprcnsd']){
			$assessment[] = 'Inappropriate repair considerations';
		}
		if ($rmvData['reconrmvassmt_conclunspt']){
			$assessment[] = 'Conclusion unsupported';
		}
		if ($rmvData['reconrmvassmt_sjbimprinacr']){
			$assessment[] = 'Subject improvements inaccurate';
		}
		if ($rmvData['reconrmvassmt_inapprcmps']){
			$assessment[] = 'Inappropriate comps';
		}
		if ($rmvData['reconrmvassmt_sbjhstinacabs']){
			$assessment[] = 'Subject market history inaccurate or absent';
		}
		if ($rmvData['reconrmvassmt_dtdcmps']){
			$assessment[] = 'Dated comps';
		}
		if ($rmvData['reconrmvassmt_sjbcndinac']){
			$assessment[] = 'Subject condition inaccurate';
		}
		if ($rmvData['reconrmvassmt_inacprptyp']){
			$assessment[] = 'Inaccurate property type';
		}
		if ($rmvData['reconrmvassmt_inaclstpr']){
			$assessment[] = 'Inaccurate list/sales prices';
		}
		if ($rmvData['reconrmvassmt_incabsphts']){
			$assessment[] = 'Incorrect/absent photos';
		}
		if ($rmvData['reconrmvassmt_inadexpl']){
			$assessment[] = 'Inadequate explanations';
		}
		if ($rmvData['reconrmvassmt_sbjstinflinac']){
			$assessment[] = 'Subject site influences inaccurate';
		}
		if ($rmvData['reconrmvassmt_incsbjprop']){
			$assessment[] = 'Incorrect subject property';
		}
		if ($rmvData['reconrmvassmt_slsfacts']){
			$assessment[] = 'Inadequate reporting of salient facts';
		}
		if ($rmvData['reconrmvassmt_sjbglainac']){
			$assessment[] = 'Subject GLA inaccurate';
		}

		$assessmentString = implode(', ', $assessment);

		 $bpo2_assessment = array();
		if ($rmvData['reconpriorbpo2_assmt_compdst']){
			$bpo2_assessment[] = 'Comp distance';
		}
		if ($rmvData['reconpriorbpo2_assmt_inapprrprcnsd']){
			$bpo2_assessment[] = 'Inappropriate repair considerations';
		}
		if ($rmvData['reconpriorbpo2_assmt_conclunspt']){
			$bpo2_assessment[] = 'Conclusion unsupported';
		}
		if ($rmvData['reconpriorbpo2_assmt_sjbimprinacr']){
			$bpo2_assessment[] = 'Subject improvements inaccurate';
		}
		if ($rmvData['reconpriorbpo2_assmt_inapprcmps']){
			$bpo2_assessment[] = 'Inappropriate comps';
		}
		if ($rmvData['reconpriorbpo2_assmt_sbjhstinacabs']){
			$bpo2_assessment[] = 'Subject market history inaccurate or absent';
		}
		if ($rmvData['reconpriorbpo2_assmt_dtdcmps']){
			$bpo2_assessment[] = 'Dated comps';
		}
		if ($rmvData['reconpriorbpo2_assmt_sjbcndinac']){
			$bpo2_assessment[] = 'Subject condition inaccurate';
		}
		if ($rmvData['reconpriorbpo2_assmt_inacprptyp']){
			$bpo2_assessment[] = 'Inaccurate property type';
		}
		if ($rmvData['reconpriorbpo2_assmt_inaclstpr']){
			$bpo2_assessment[] = 'Inaccurate list/sales prices';
		}
		if ($rmvData['reconpriorbpo2_assmt_incabsphts']){
			$bpo2_assessment[] = 'Incorrect/absent photos';
		}
		if ($rmvData['reconpriorbpo2_assmt_inadexpl']){
			$bpo2_assessment[] = 'Inadequate explanations';
		}
		if ($rmvData['reconpriorbpo2_assmt_sbjstinflinac']){
			$bpo2_assessment[] = 'Subject site influences inaccurate';
		}
		if ($rmvData['reconpriorbpo2_assmt_incsbjprop']){
			$bpo2_assessment[] = 'Incorrect subject property';
		}
		if ($rmvData['reconpriorbpo2_assmt_slsfacts']){
			$bpo2_assessment[] = 'Inadequate reporting of salient facts';
		}
		if ($rmvData['reconpriorbpo2_assmt_sjbglainac']){
			$bpo2_assessment[] = 'Subject GLA inaccurate';
		}
		$bpo2_assessmentString = implode(', ', $bpo2_assessment);

		 $bpo3_assessment = array();
		if ($rmvData['reconpriorbpo3_assmt_compdst']){
			$bpo3_assessment[] = 'Comp distance';
		}
		if ($rmvData['reconpriorbpo3_assmt_inapprrprcnsd']){
			$bpo3_assessment[] = 'Inappropriate repair considerations';
		}
		if ($rmvData['reconpriorbpo3_assmt_conclunspt']){
			$bpo3_assessment[] = 'Conclusion unsupported';
		}
		if ($rmvData['reconpriorbpo3_assmt_sjbimprinacr']){
			$bpo3_assessment[] = 'Subject improvements inaccurate';
		}
		if ($rmvData['reconpriorbpo3_assmt_inapprcmps']){
			$bpo3_assessment[] = 'Inappropriate comps';
		}
		if ($rmvData['reconpriorbpo3_assmt_sbjhstinacabs']){
			$bpo3_assessment[] = 'Subject market history inaccurate or absent';
		}
		if ($rmvData['reconpriorbpo3_assmt_dtdcmps']){
			$bpo3_assessment[] = 'Dated comps';
		}
		if ($rmvData['reconpriorbpo3_assmt_sjbcndinac']){
			$bpo3_assessment[] = 'Subject condition inaccurate';
		}
		if ($rmvData['reconpriorbpo3_assmt_inacprptyp']){
			$bpo3_assessment[] = 'Inaccurate property type';
		}
		if ($rmvData['reconpriorbpo3_assmt_inaclstpr']){
			$bpo3_assessment[] = 'Inaccurate list/sales prices';
		}
		if ($rmvData['reconpriorbpo3_assmt_incabsphts']){
			$bpo3_assessment[] = 'Incorrect/absent photos';
		}
		if ($rmvData['reconpriorbpo3_assmt_inadexpl']){
			$bpo3_assessment[] = 'Inadequate explanations';
		}
		if ($rmvData['reconpriorbpo3_assmt_sbjstinflinac']){
			$bpo3_assessment[] = 'Subject site influences inaccurate';
		}
		if ($rmvData['reconpriorbpo3_assmt_incsbjprop']){
			$bpo3_assessment[] = 'Incorrect subject property';
		}
		if ($rmvData['reconpriorbpo3_assmt_slsfacts']){
			$bpo3_assessment[] = 'Inadequate reporting of salient facts';
		}
		if ($rmvData['reconpriorbpo3_assmt_sjbglainac']){
			$bpo3_assessment[] = 'Subject GLA inaccurate';
		}
		$bpo3_assessmentString = implode(', ', $bpo3_assessment);

		 $bpo4_assessment = array();
		if ($rmvData['reconpriorbpo4_assmt_compdst']){
			$bpo4_assessment[] = 'Comp distance';
		}
		if ($rmvData['reconpriorbpo4_assmt_inapprrprcnsd']){
			$bpo4_assessment[] = 'Inappropriate repair considerations';
		}
		if ($rmvData['reconpriorbpo4_assmt_conclunspt']){
			$bpo4_assessment[] = 'Conclusion unsupported';
		}
		if ($rmvData['reconpriorbpo4_assmt_sjbimprinacr']){
			$bpo4_assessment[] = 'Subject improvements inaccurate';
		}
		if ($rmvData['reconpriorbpo4_assmt_inapprcmps']){
			$bpo4_assessment[] = 'Inappropriate comps';
		}
		if ($rmvData['reconpriorbpo4_assmt_sbjhstinacabs']){
			$bpo4_assessment[] = 'Subject market history inaccurate or absent';
		}
		if ($rmvData['reconpriorbpo4_assmt_dtdcmps']){
			$bpo4_assessment[] = 'Dated comps';
		}
		if ($rmvData['reconpriorbpo4_assmt_sjbcndinac']){
			$bpo4_assessment[] = 'Subject condition inaccurate';
		}
		if ($rmvData['reconpriorbpo4_assmt_inacprptyp']){
			$bpo4_assessment[] = 'Inaccurate property type';
		}
		if ($rmvData['reconpriorbpo4_assmt_inaclstpr']){
			$bpo4_assessment[] = 'Inaccurate list/sales prices';
		}
		if ($rmvData['reconpriorbpo4_assmt_incabsphts']){
			$bpo4_assessment[] = 'Incorrect/absent photos';
		}
		if ($rmvData['reconpriorbpo4_assmt_inadexpl']){
			$bpo4_assessment[] = 'Inadequate explanations';
		}
		if ($rmvData['reconpriorbpo4_assmt_sbjstinflinac']){
			$bpo4_assessment[] = 'Subject site influences inaccurate';
		}
		if ($rmvData['reconpriorbpo4_assmt_incsbjprop']){
			$bpo4_assessment[] = 'Incorrect subject property';
		}
		if ($rmvData['reconpriorbpo4_assmt_slsfacts']){
			$bpo4_assessment[] = 'Inadequate reporting of salient facts';
		}
		if ($rmvData['reconpriorbpo4_assmt_sjbglainac']){
			$bpo4_assessment[] = 'Subject GLA inaccurate';
		}
		$bpo4_assessmentString = implode(', ', $bpo3_assessment);

		$vionations = array();
		if ($rmvData['reconrmvvio_bad_data']){
			$vionations[] = 'Bad Data';
		}
		if ($rmvData['reconrmvvio_fraud_sales']){
			$vionations[] = 'Fraudulent Sales';
		}
		if ($rmvData['reconrmvvio_inappr_adj']){
			$vionations[] = 'Inappropriate Adjustments';
		}
		if ($rmvData['reconrmvvio_inappr_comps']){
			$vionations[] = 'Inappropriate Comps';
		}
		if ($rmvData['reconrmvvio_incorrect_adj']){
			$vionations[] = 'Incorrect Adjustments';
		}
		if ($rmvData['reconrmvvio_incorrect_dist']){
			$vionations[] = 'Incorrect Distance';
		}


		$violationsReasons = implode(', ', $vionations);



		$sql = "
			SELECT *
			FROM reconrmvvio_reconrmvviolations_tbl
			WHERE reconrmvvio_reconid_int = ?";

		$violationsData = $this->getAdapter()->fetchRow(
		   $sql,
		   $reconId
		);

		return array(
		   'rmv'        => $rmvData,
		   'comps'      => $comps,
		   'violations' => $violationsData,
		   'violationsReasons' => $violationsReasons,
		   'assesmentReasons'  => $assessmentString,
			 'bpo2_assessmentReasons' => $bpo2_assessmentString,
			 'bpo3_assessmentReasons' => $bpo3_assessmentString,
			 'bpo4_assessmentReasons' => $bpo4_assessmentString
		);
	}












	/**
	 * Get Chart Data
	 *
	 * Returns VisiFire chart data for a given dataset.  This method will acts
	 * as a front-controller of sorts and will "outsource" actual reporting to
	 * other methods based on the $chartName provided.
	 *
	 * @param string $chartName
	 */
	public function getChartData($chartName="userrmvsubmissions", $asVisiFireXml=true)
	{
		$baseMethodName = "_getChartData_";

		$methodName = $baseMethodName . $chartName;

		if (method_exists($this, $methodName)) {
			return $this->$methodName($asVisiFireXml);
		}

		throw new Exception("Unknown chart name: '{$chartName}'.  Method {$methodName} not found in " . __FILE__ .'.');
	}


	private function _getChartData_userrmvsubmissions($asVisiFireXml)
	{
		$sql = "
			SELECT
				reconusr_Name_char          AS `userName`,
				COUNT(*)                    AS `numSumissions`,
				DATE_FORMAT(DATE(act_inserted_datetime), '%c/%e/%Y') AS `dateSubmitted`
			FROM act_actionlog_tbl
			JOIN reconusr_reconuser_tbl ON
				act_reconuser_ID_int = reconusr_ID_int
			WHERE
				reconusr_ID_int = ?
			GROUP BY
				DATE(act_inserted_datetime)";

		$data = $this->_db->fetchAll(
			$sql,
			Zend_Auth::getInstance()->getIdentity()->reconusr_ID_int,
			Zend_Db::FETCH_ASSOC
		);

		// Raw data requested
		if (!$asVisiFireXml) {
			return $data;
		}


		$xmlTemplate = '<vc:Chart xmlns:vc="clr-namespace:Visifire.Charts;assembly=Visifire.Charts" Theme="Theme1" UniqueColors="False" Width="500" Watermark="False">
<vc:Title Text="My RMV Submissions"/>
<vc:AxisY Title="Total Submitted Orders"/>
{dataSeries}
</vc:Chart>';
		$xmlDataSeriesTemplate = '<vc:DataSeries Name="Num. Submissions" RenderAs="Column" Cursor="Hand">{dataPoints}</vc:DataSeries>';


		$dataPoints = array();

		foreach ($data as $userData) {
			$dataPoints[] = '<vc:DataPoint AxisLabel="' . $userData['dateSubmitted'] . '" YValue="' . $userData['numSumissions'] . '"/>';
		}

		$dataSeries = str_replace('{dataPoints}', implode('', $dataPoints), $xmlDataSeriesTemplate);
		$finalXml   = str_replace('{dataSeries}', $dataSeries, $xmlTemplate);

		return $finalXml;
	}

	public function getLastComment($reconId)
	{
		$db = $this->getAdapter();
		$sql = "SELECT
				 recontxt_Reconciliation_text
				 FROM
				  recontxt_reconciliationtext_tbl
				 WHERE
				  recontxt_recon_ID_int = ?
				 ORDER BY
				  recontxt_ID_int DESC
				 LIMIT 1";
		$stmt = $db->prepare($sql);
		$stmt->bindValue(1, $reconId);
		$stmt->execute();
		return $stmt->fetchColumn();
	}

	public function getFailedReasons()
	{
		$db = $this->getAdapter();
		$sql = "SELECT * FROM reconfreas_reconciliationfailedreasons_tbl";
		return $db->fetchAll($sql);
	}
	
	public function getFMVDaysToSellOpts()
	{
		$db = $this->getAdapter();
		$sql = "SELECT * FROM dd_estimateddaystosell_tbl";
		return $db->fetchAll($sql);
	}

	public function getLastNote($id)
	{
		$db = $this->getAdapter();
		$sql = "SELECT reconnt_type_enum, reconnt_note_text, reconnt_inserted_datetime, reconusr_Login_char, reconnt_classification_varchar
				FROM
				 recon_reconciliationorder_tbl
				 JOIN act_actionlog_tbl ON act_recon_ID_int = recon_ID_int
				 JOIN reconnt_reconnotes_tbl ON reconnt_ID_int=act_reconnt_ID_int
				 JOIN reconusr_reconuser_tbl ON reconusr_ID_int = act_reconuser_ID_int
				WHERE
				 recon_ID_int = ? AND
				 reconnt_type_enum = 'RMV Summary Rejection'
				ORDER BY
				 act_ID_int DESC
				LIMIT 1";
		$stmt = $db->prepare($sql);
		$stmt->bindValue(1, $id);
		$stmt->execute();
		return $stmt->fetch();
	}

	public function getAffirmFieldData($reconid)
	{
		$stmt = $this->getAdapter()->prepare("SELECT * FROM reconafldaff_affirmrmvfields_tbl WHERE reconafldaff_recon_ID_int = ?");
		$stmt->execute(array($reconid));
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function saveAffirmRMVFields($data, $affirm = false)
	{
		$db = $this->getAdapter();

		$stmt = $db->prepare("DELETE FROM reconafldaff_affirmrmvfields_tbl WHERE reconafldaff_recon_ID_int = ? AND reconafldaff_fieldid_char = ?");
		$stmt->execute(array($data['reconid'], $data['fieldid']));

		if (true===$affirm) {
			$tblData = array(
				'reconafldaff_recon_ID_int' => $data['reconid'],
				'reconafldaff_reconusr_ID_int' => $data['userid'],
				'reconafldaff_fieldid_char' => $data['fieldid'],
				'reconafldaff_fieldlabel_char' => $data['label'],
				'reconafldaff_affirmed_datetime' => new Zend_Db_Expr('NOW()')
			);
			$db->insert('reconafldaff_affirmrmvfields_tbl', $tblData);
		}
	}

	public function getLocationCodeByZip($zipCode)
	{
		$left4 = intval(substr($zipCode, 0, 4));
		$left3 = intval(substr($zipCode, 0, 3));
		$zip = intval($zipCode);

		$sql = "SELECT RuralCode, 5 AS ZipMatch
			FROM  greatdata.rural_zip_tbl
			WHERE Zip = :zipcode
			AND RuralCode IN('U','S','R')
			UNION SELECT RuralCode, 4 ZipMatch
			FROM  greatdata.rural_zip_tbl
			WHERE LEFT(Zip,4) = :zipfour
			AND RuralCode IN('U','S','R')
			UNION SELECT RuralCode, 3 ZipMatch
			FROM  greatdata.rural_zip_tbl
			WHERE LEFT(Zip,3) = :zipthree
			AND RuralCode IN('U','S','R')
			ORDER BY ZipMatch DESC
			LIMIT 1";

		$stmt = $this->getAdapter()->prepare($sql);
		$stmt->bindParam(':zipcode', $zip);
		$stmt->bindParam(':zipfour', $left4);
		$stmt->bindParam(':zipthree', $left3);

		$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);

		return trim($row['RuralCode']);
	}
}
<?php

class Default_Model_Order extends Zend_Db_Table_Abstract
{
	/** Table name */
	protected $_name = 'recon_reconciliationorder_tbl';

	public $totalManagedOrders = 0;
	public $totalWQOrders = 0;
	public $totalUserWQOrders = 0;
	public $totalPeerReviewOrders = 0;

	const JOBTITLE_SPO = 'Review Appraiser NOSPO';

	/**
	 * Get current user company info
	 *
	 * @return array
	 */
    private function _getCurrentUserCompany()
    {
        $companyId = Zend_Auth::getInstance()->getIdentity()->reconusr_co_ID_int;

        $sql = "
            SELECT
                co_ID_int            `id`,
                co_abbreviation_char `abbreviation`,
                co_name_varchar      `name`
            FROM co_company_tbl
            WHERE co_ID_int = ?";

        return $this->getAdapter()->fetchRow($sql, $companyId, Zend_Db::FETCH_ASSOC);
    }



	function logStatusChange($newstatus, $ids) {
		$db = $this->getAdapter();
		$changedBy = Zend_Auth::getInstance()->getIdentity()->reconusr_Login_char;

		foreach ($ids as $id) {
			$sql ="INSERT INTO reconstslog_reconciliationorderstatuslog_tbl(
						reconstslog_recon_id_int,
						reconstslog_prev_status_char,
						reconstslog_new_status_char,
						reconstslog_changedby_char,
						reconstslog_changedon_datetime)
				SELECT {$id}, recon_Status_char, '{$newstatus}', '{$changedBy}', NOW()
				FROM recon_reconciliationorder_tbl WHERE recon_ID_int = {$id}";
			$writer = new Zend_Log_Writer_Stream(dirname(__FILE__).'/../../logs/debug.log');
			$logger = new Zend_Log($writer);
			$logger->info('do set status : '.$sql);
			$db->query($sql);
		}
	}

	function getOrderStatuses() {
		$db = $this->getAdapter();
		$sql = "select reconsts_ReconciliationOrderStatus_char from reconsts_reconciliationorderstatus_tbl";
		$data = $db->query($sql)->fetchAll();
		return $data;
	}


	/**
	 * Get a user's workqueue orders
	 *
	 * @param string $username
	 * @return string
	 */
	public function getUserWQOrders($username,$start = 0, $limit = 25, $sort = '', $dir = 'ASC') {
		$db = $this->getAdapter();

		$orderby = " IF(LOANOFFICER_ORG_NAME  LIKE '%SPO%' OR CUSTOM5  LIKE '%SPO%',0,1)";
		$orderby .= ',recon_Priority_enum ASC,recon_ID_int ASC';
		if (strlen($sort) > 0) {
			$orderby = "{$sort} {$dir}";
		}

        $sql = "
            SELECT SQL_CALC_FOUND_ROWS
                                reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_date AS reconpriorbpo2_review_date,
                                reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_vendor_char AS reconpriorbpo2_review_vendor_char,
                                reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_access_enum AS reconpriorbpo2_review_access_enum,
                                reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_90_as_is_int AS reconpriorbpo2_review_90_as_is_int,
                                reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_90_as_rep_int AS reconpriorbpo2_review_90_as_rep_int,
                                reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_assessment_enum AS reconpriorbpo2_review_assessment_enum,
                                reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_notes_text AS reconpriorbpo2_review_notes,
                                reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_comment_char AS reconpriorbpo2_review_comment,
                                reconpriorbpo2_.reconpriorbpo_reconrmvassmt_compdst AS reconpriorbpo2_assmt_compdst,
                                reconpriorbpo2_.reconpriorbpo_reconrmvassmt_inapprrprcnsd AS reconpriorbpo2_assmt_inapprrprcnsd,
                                reconpriorbpo2_.reconpriorbpo_reconrmvassmt_conclunspt AS reconpriorbpo2_assmt_conclunspt,
                                reconpriorbpo2_.reconpriorbpo_reconrmvassmt_sjbimprinacr AS reconpriorbpo2_assmt_sjbimprinacr,
                                reconpriorbpo2_.reconpriorbpo_reconrmvassmt_inapprcmps AS reconpriorbpo2_assmt_inapprcmps,
                                reconpriorbpo2_.reconpriorbpo_reconrmvassmt_sbjhstinacabs AS reconpriorbpo2_assmt_sbjhstinacabs,
                                reconpriorbpo2_.reconpriorbpo_reconrmvassmt_dtdcmps AS reconpriorbpo2_assmt_dtdcmps,
                                reconpriorbpo2_.reconpriorbpo_reconrmvassmt_sjbcndinac AS reconpriorbpo2_assmt_sjbcndinac,
                                reconpriorbpo2_.reconpriorbpo_reconrmvassmt_inaclstpr AS reconpriorbpo2_assmt_inaclstpr,
                                reconpriorbpo2_.reconpriorbpo_reconrmvassmt_incabsphts AS reconpriorbpo2_assmt_incabsphts,
                                reconpriorbpo2_.reconpriorbpo_reconrmvassmt_inadexpl AS reconpriorbpo2_assmt_inadexpl,
                                reconpriorbpo2_.reconpriorbpo_reconrmvassmt_sbjstinflinac AS reconpriorbpo2_assmt_sbjstinflinac,
                                reconpriorbpo2_.reconpriorbpo_reconrmvassmt_incsbjprop AS reconpriorbpo2_assmt_incsbjprop,
                                reconpriorbpo2_.reconpriorbpo_reconrmvassmt_slsfacts AS reconpriorbpo2_assmt_slsfacts,
                                reconpriorbpo2_.reconpriorbpo_reconrmvassmt_sjbglainac AS reconpriorbpo2_assmt_sjbglainac,
                                reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_date AS reconpriorbpo3_review_date,
                                reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_vendor_char AS reconpriorbpo3_review_vendor_char,
                                reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_access_enum AS reconpriorbpo3_review_access_enum,
                                reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_90_as_is_int AS reconpriorbpo3_review_90_as_is_int,
                                reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_90_as_rep_int AS reconpriorbpo3_review_90_as_rep_int,
                                reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_assessment_enum AS reconpriorbpo3_review_assessment_enum,
                                reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_notes_text AS reconpriorbpo3_review_notes,
                                reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_comment_char AS reconpriorbpo3_review_comment,
                                reconpriorbpo3_.reconpriorbpo_reconrmvassmt_compdst AS reconpriorbpo3_assmt_compdst,
                                reconpriorbpo3_.reconpriorbpo_reconrmvassmt_inapprrprcnsd AS reconpriorbpo3_assmt_inapprrprcnsd,
                                reconpriorbpo3_.reconpriorbpo_reconrmvassmt_conclunspt AS reconpriorbpo3_assmt_conclunspt,
                                reconpriorbpo3_.reconpriorbpo_reconrmvassmt_sjbimprinacr AS reconpriorbpo3_assmt_sjbimprinacr,
                                reconpriorbpo3_.reconpriorbpo_reconrmvassmt_inapprcmps AS reconpriorbpo3_assmt_inapprcmps,
                                reconpriorbpo3_.reconpriorbpo_reconrmvassmt_sbjhstinacabs AS reconpriorbpo3_assmt_sbjhstinacabs,
                                reconpriorbpo3_.reconpriorbpo_reconrmvassmt_dtdcmps AS reconpriorbpo3_assmt_dtdcmps,
                                reconpriorbpo3_.reconpriorbpo_reconrmvassmt_sjbcndinac AS reconpriorbpo3_assmt_sjbcndinac,
                                reconpriorbpo3_.reconpriorbpo_reconrmvassmt_inaclstpr AS reconpriorbpo3_assmt_inaclstpr,
                                reconpriorbpo3_.reconpriorbpo_reconrmvassmt_incabsphts AS reconpriorbpo3_assmt_incabsphts,
                                reconpriorbpo3_.reconpriorbpo_reconrmvassmt_inadexpl AS reconpriorbpo3_assmt_inadexpl,
                                reconpriorbpo3_.reconpriorbpo_reconrmvassmt_sbjstinflinac AS reconpriorbpo3_assmt_sbjstinflinac,
                                reconpriorbpo3_.reconpriorbpo_reconrmvassmt_incsbjprop AS reconpriorbpo3_assmt_incsbjprop,
                                reconpriorbpo3_.reconpriorbpo_reconrmvassmt_slsfacts AS reconpriorbpo3_assmt_slsfacts,
                                reconpriorbpo3_.reconpriorbpo_reconrmvassmt_sjbglainac AS reconpriorbpo3_assmt_sjbglainac,
                                reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_date AS reconpriorbpo4_review_date,
                                reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_vendor_char AS reconpriorbpo4_review_vendor_char,
                                reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_access_enum AS reconpriorbpo4_review_access_enum,
                                reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_90_as_is_int AS reconpriorbpo4_review_90_as_is_int,
                                reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_90_as_rep_int AS reconpriorbpo4_review_90_as_rep_int,
                                reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_assessment_enum AS reconpriorbpo4_review_assessment_enum,
                                reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_notes_text AS reconpriorbpo4_review_notes,
                                reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_comment_char AS reconpriorbpo4_review_comment,
                                reconpriorbpo4_.reconpriorbpo_reconrmvassmt_compdst AS reconpriorbpo4_assmt_compdst,
                                reconpriorbpo4_.reconpriorbpo_reconrmvassmt_inapprrprcnsd AS reconpriorbpo4_assmt_inapprrprcnsd,
                                reconpriorbpo4_.reconpriorbpo_reconrmvassmt_conclunspt AS reconpriorbpo4_assmt_conclunspt,
                                reconpriorbpo4_.reconpriorbpo_reconrmvassmt_sjbimprinacr AS reconpriorbpo4_assmt_sjbimprinacr,
                                reconpriorbpo4_.reconpriorbpo_reconrmvassmt_inapprcmps AS reconpriorbpo4_assmt_inapprcmps,
                                reconpriorbpo4_.reconpriorbpo_reconrmvassmt_sbjhstinacabs AS reconpriorbpo4_assmt_sbjhstinacabs,
                                reconpriorbpo4_.reconpriorbpo_reconrmvassmt_dtdcmps AS reconpriorbpo4_assmt_dtdcmps,
                                reconpriorbpo4_.reconpriorbpo_reconrmvassmt_sjbcndinac AS reconpriorbpo4_assmt_sjbcndinac,
                                reconpriorbpo4_.reconpriorbpo_reconrmvassmt_inaclstpr AS reconpriorbpo4_assmt_inaclstpr,
                                reconpriorbpo4_.reconpriorbpo_reconrmvassmt_incabsphts AS reconpriorbpo4_assmt_incabsphts,
                                reconpriorbpo4_.reconpriorbpo_reconrmvassmt_inadexpl AS reconpriorbpo4_assmt_inadexpl,
                                reconpriorbpo4_.reconpriorbpo_reconrmvassmt_sbjstinflinac AS reconpriorbpo4_assmt_sbjstinflinac,
                                reconpriorbpo4_.reconpriorbpo_reconrmvassmt_incsbjprop AS reconpriorbpo4_assmt_incsbjprop,
                                reconpriorbpo4_.reconpriorbpo_reconrmvassmt_slsfacts AS reconpriorbpo4_assmt_slsfacts,
                                reconpriorbpo4_.reconpriorbpo_reconrmvassmt_sjbglainac AS reconpriorbpo4_assmt_sjbglainac,

                                recon_reconciliationorder_tbl.*,
                                reconvalarc_valuationarchive_tbl.*,
                                reconrmvvio_reconrmvviolations_tbl.*,
                                reconrmvassmt_reconrmvassess_tbl.*,
                                reconrpradd_reconrepairaddendum_tbl.*,
                                rmv_reconciledmarketvalue_tbl.*,
                                reconvalarcexc_valuationarchiveexceptions_tbl.*,
                                realquestpro_files_tbl.realquestpro_compDetail_req AS realquestpro_compDetail_req,
                                reconobsinfl_.*,
                                IF(LOANOFFICER_ORG_NAME LIKE '%SPO%' || CUSTOM5 LIKE '%SPO%',1,0) AS is_spo
                                FROM recon_reconciliationorder_tbl
				 JOIN reconvalarc_valuationarchive_tbl ON recon_ID_int = reconvalarc_recon_ID_int                                  
                                 LEFT JOIN reconobsinfl_reconobservedinfluences_tbl reconobsinfl_ ON recon_ID_int = reconobsinfl_recon_ID_int
                                 LEFT JOIN realquestpro_files_tbl USING (recon_ord_ID_int)
                                 LEFT JOIN xmldb_fnc.PUSHORDER_ORDER_tbl ON recon_ord_ID_int = PUSHORDER_ORDER_ord_ID_int
                                 LEFT JOIN reconrmvvio_reconrmvviolations_tbl ON recon_ID_int = reconrmvvio_reconid_int
                                 LEFT JOIN reconrmvassmt_reconrmvassess_tbl ON recon_ID_int = reconrmvassmt_reconid_int
                                 LEFT JOIN reconrpradd_reconrepairaddendum_tbl ON recon_ID_int = reconrpradd_reconid_int
                                 LEFT JOIN rmv_reconciledmarketvalue_tbl ON recon_ID_int = rmv_recon_ID_int
                                 LEFT JOIN reconvalarcexc_valuationarchiveexceptions_tbl ON reconvalarc_ID_int = reconvalarcexc_reconvalarc_ID_int
                                 LEFT JOIN reconpriorbpo_priorbporeview_tbl reconpriorbpo2_
                                  ON reconpriorbpo2_.reconpriorbpo_rmv_recon_ID_int = recon_reconciliationorder_tbl.recon_ID_int AND reconpriorbpo2_.reconpriorbpo_prior_bpo_file_type_char = 'BPO 2'
                                 LEFT JOIN reconpriorbpo_priorbporeview_tbl reconpriorbpo3_
                                  ON reconpriorbpo3_.reconpriorbpo_rmv_recon_ID_int = recon_reconciliationorder_tbl.recon_ID_int AND reconpriorbpo3_.reconpriorbpo_prior_bpo_file_type_char = 'BPO 3'
                                 LEFT JOIN reconpriorbpo_priorbporeview_tbl reconpriorbpo4_
                                  ON reconpriorbpo4_.reconpriorbpo_rmv_recon_ID_int = recon_reconciliationorder_tbl.recon_ID_int AND reconpriorbpo4_.reconpriorbpo_prior_bpo_file_type_char = 'BPO 4'

                                 WHERE
                          recon_AssignedTo_char = :userName
                          AND recon_Status_char NOT IN (
                              'Order Canceled',
                              'Submitted',
                              'Reconciled',
                              'Order Delivered',
                              'Approved',
                              'Auto Approved',
                              'Pending Files',
                              'Pending Peer Review',
                              'Peer Review In Progress',
                              'Peer Review Approved'
                          )
                          AND (reconvalarc_DestVendor_char = :companyAbbr OR 0=:companyId)
		      ORDER BY
		          {$orderby}
			  LIMIT {$start},{$limit}";

        $companyInfo = Default_Model_Company::getCurrentUserCompany();



			//$writer = new Zend_Log_Writer_Stream(dirname(__FILE__).'/../../logs/debug.log');
			//$logger = new Zend_Log($writer);
			//$logger->info("UserName : ".$username);
			//$logger->info("CoInfo : ".print_r($companyInfo,true));
			//$logger->info("SQL : ".$sql);

        $data = $db->fetchAll(
            $sql,
            array(
                ':userName'    => $username,
                ':companyAbbr' => $companyInfo['abbreviation'],
                ':companyId'   => $companyInfo['id']
            )
        );

        $rs = $db->fetchCol('SELECT FOUND_ROWS()');
		$this->totalUserWQOrders = $rs[0];
		return $data;
	}

	/**
	 * Get Peer Review workqueue orders
	 *
	 * @param string $username
	 * @return string
	 */
	public function getPeerReviewOrders($username, $orderId = 0, $start = 0, $limit = 25, $sort = '', $dir = 'ASC') {
		$db = $this->getAdapter();

		$orderby = " IF(LOANOFFICER_ORG_NAME  LIKE '%SPO%' OR CUSTOM5  LIKE '%SPO%',0,1)";
		$orderby .= ',recon_Priority_enum ASC,recon_ID_int ASC';
		if (strlen($sort) > 0) {
			$orderby = "{$sort} {$dir}";
		}

		$whereClause = $db->quoteInto(' AND recon_PeerReviewAssignedTo_char = ?', $username);
		if ($orderId > 0) {
		    $whereClause = $db->quoteInto(' AND recon_ord_ID_int = ?', $orderId);
		}

        $sql = "
            SELECT SQL_CALC_FOUND_ROWS
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_date AS reconpriorbpo2_review_date,
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_vendor_char AS reconpriorbpo2_review_vendor_char,
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_access_enum AS reconpriorbpo2_review_access_enum,
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_90_as_is_int AS reconpriorbpo2_review_90_as_is_int,
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_90_as_rep_int AS reconpriorbpo2_review_90_as_rep_int,
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_assessment_enum AS reconpriorbpo2_review_assessment_enum,
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_notes_text AS reconpriorbpo2_review_notes,
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_comment_char AS reconpriorbpo2_review_comment,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_compdst AS reconpriorbpo2_assmt_compdst,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_inapprrprcnsd AS reconpriorbpo2_assmt_inapprrprcnsd,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_conclunspt AS reconpriorbpo2_assmt_conclunspt,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_sjbimprinacr AS reconpriorbpo2_assmt_sjbimprinacr,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_inapprcmps AS reconpriorbpo2_assmt_inapprcmps,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_sbjhstinacabs AS reconpriorbpo2_assmt_sbjhstinacabs,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_dtdcmps AS reconpriorbpo2_assmt_dtdcmps,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_sjbcndinac AS reconpriorbpo2_assmt_sjbcndinac,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_inaclstpr AS reconpriorbpo2_assmt_inaclstpr,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_incabsphts AS reconpriorbpo2_assmt_incabsphts,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_inadexpl AS reconpriorbpo2_assmt_inadexpl,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_sbjstinflinac AS reconpriorbpo2_assmt_sbjstinflinac,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_incsbjprop AS reconpriorbpo2_assmt_incsbjprop,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_slsfacts AS reconpriorbpo2_assmt_slsfacts,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_sjbglainac AS reconpriorbpo2_assmt_sjbglainac,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_date AS reconpriorbpo3_review_date,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_vendor_char AS reconpriorbpo3_review_vendor_char,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_access_enum AS reconpriorbpo3_review_access_enum,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_90_as_is_int AS reconpriorbpo3_review_90_as_is_int,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_90_as_rep_int AS reconpriorbpo3_review_90_as_rep_int,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_assessment_enum AS reconpriorbpo3_review_assessment_enum,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_notes_text AS reconpriorbpo3_review_notes,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_comment_char AS reconpriorbpo3_review_comment,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_compdst AS reconpriorbpo3_assmt_compdst,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_inapprrprcnsd AS reconpriorbpo3_assmt_inapprrprcnsd,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_conclunspt AS reconpriorbpo3_assmt_conclunspt,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_sjbimprinacr AS reconpriorbpo3_assmt_sjbimprinacr,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_inapprcmps AS reconpriorbpo3_assmt_inapprcmps,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_sbjhstinacabs AS reconpriorbpo3_assmt_sbjhstinacabs,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_dtdcmps AS reconpriorbpo3_assmt_dtdcmps,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_sjbcndinac AS reconpriorbpo3_assmt_sjbcndinac,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_inaclstpr AS reconpriorbpo3_assmt_inaclstpr,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_incabsphts AS reconpriorbpo3_assmt_incabsphts,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_inadexpl AS reconpriorbpo3_assmt_inadexpl,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_sbjstinflinac AS reconpriorbpo3_assmt_sbjstinflinac,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_incsbjprop AS reconpriorbpo3_assmt_incsbjprop,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_slsfacts AS reconpriorbpo3_assmt_slsfacts,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_sjbglainac AS reconpriorbpo3_assmt_sjbglainac,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_date AS reconpriorbpo4_review_date,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_vendor_char AS reconpriorbpo4_review_vendor_char,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_access_enum AS reconpriorbpo4_review_access_enum,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_90_as_is_int AS reconpriorbpo4_review_90_as_is_int,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_90_as_rep_int AS reconpriorbpo4_review_90_as_rep_int,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_assessment_enum AS reconpriorbpo4_review_assessment_enum,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_notes_text AS reconpriorbpo4_review_notes,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_comment_char AS reconpriorbpo4_review_comment,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_compdst AS reconpriorbpo4_assmt_compdst,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_inapprrprcnsd AS reconpriorbpo4_assmt_inapprrprcnsd,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_conclunspt AS reconpriorbpo4_assmt_conclunspt,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_sjbimprinacr AS reconpriorbpo4_assmt_sjbimprinacr,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_inapprcmps AS reconpriorbpo4_assmt_inapprcmps,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_sbjhstinacabs AS reconpriorbpo4_assmt_sbjhstinacabs,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_dtdcmps AS reconpriorbpo4_assmt_dtdcmps,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_sjbcndinac AS reconpriorbpo4_assmt_sjbcndinac,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_inaclstpr AS reconpriorbpo4_assmt_inaclstpr,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_incabsphts AS reconpriorbpo4_assmt_incabsphts,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_inadexpl AS reconpriorbpo4_assmt_inadexpl,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_sbjstinflinac AS reconpriorbpo4_assmt_sbjstinflinac,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_incsbjprop AS reconpriorbpo4_assmt_incsbjprop,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_slsfacts AS reconpriorbpo4_assmt_slsfacts,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_sjbglainac AS reconpriorbpo4_assmt_sjbglainac,

				recon_reconciliationorder_tbl.*,
				reconvalarc_valuationarchive_tbl.*,
				reconrmvvio_reconrmvviolations_tbl.*,
				reconrmvassmt_reconrmvassess_tbl.*,
				reconrpradd_reconrepairaddendum_tbl.*,
				rmv_reconciledmarketvalue_tbl.*,
				reconvalarcexc_valuationarchiveexceptions_tbl.*,
				realquestpro_files_tbl.realquestpro_compDetail_req as realquestpro_compDetail_req,
				reconobsinfl_.*,
				IF(LOANOFFICER_ORG_NAME LIKE '%SPO%' || CUSTOM5 LIKE '%SPO%',1,0) AS is_spo
				FROM recon_reconciliationorder_tbl
				 JOIN reconvalarc_valuationarchive_tbl ON reconvalarc_recon_ID_int = recon_ID_int
				 LEFT JOIN reconobsinfl_reconobservedinfluences_tbl reconobsinfl_ ON recon_ID_int = reconobsinfl_recon_ID_int
				 LEFT JOIN realquestpro_files_tbl USING (recon_ord_ID_int)
				 LEFT JOIN xmldb_fnc.PUSHORDER_ORDER_tbl ON recon_ord_ID_int = PUSHORDER_ORDER_ord_ID_int
				 LEFT JOIN reconrmvvio_reconrmvviolations_tbl ON recon_ID_int = reconrmvvio_reconid_int
				 LEFT JOIN reconrmvassmt_reconrmvassess_tbl ON recon_ID_int = reconrmvassmt_reconid_int
				 LEFT JOIN reconrpradd_reconrepairaddendum_tbl ON recon_ID_int = reconrpradd_reconid_int
				 LEFT JOIN rmv_reconciledmarketvalue_tbl ON recon_ID_int = rmv_recon_ID_int
				 LEFT JOIN reconvalarcexc_valuationarchiveexceptions_tbl ON reconvalarc_ID_int = reconvalarcexc_reconvalarc_ID_int
				 LEFT JOIN reconpriorbpo_priorbporeview_tbl reconpriorbpo2_
				  ON reconpriorbpo2_.reconpriorbpo_rmv_recon_ID_int = recon_reconciliationorder_tbl.recon_ID_int AND reconpriorbpo2_.reconpriorbpo_prior_bpo_file_type_char = 'BPO 2'
				 LEFT JOIN reconpriorbpo_priorbporeview_tbl reconpriorbpo3_
				  ON reconpriorbpo3_.reconpriorbpo_rmv_recon_ID_int = recon_reconciliationorder_tbl.recon_ID_int AND reconpriorbpo3_.reconpriorbpo_prior_bpo_file_type_char = 'BPO 3'
				 LEFT JOIN reconpriorbpo_priorbporeview_tbl reconpriorbpo4_
				  ON reconpriorbpo4_.reconpriorbpo_rmv_recon_ID_int = recon_reconciliationorder_tbl.recon_ID_int AND reconpriorbpo4_.reconpriorbpo_prior_bpo_file_type_char = 'BPO 4'

				 WHERE
		          recon_Status_char = 'Peer Review In Progress'
		          {$whereClause}
		      ORDER BY
		          {$orderby}
			  LIMIT {$start},{$limit}";
			  //Zend_Registry::get('logsql')->info(__METHOD__ . "::$username::\n" . $sql);
        $data = $db->fetchAll($sql);

        $rs = $db->fetchCol('SELECT FOUND_ROWS()');
		$this->totalPeerReviewOrders = $rs[0];
		return $data;
	}

	/**
	 * Get manager's WorkQueue review order(s)
	 *
	 * This method has been updated to limit companies to their own orders.
	 * Company Zero can load all orders.
	 *
	 * @subpackage Multi-Company
	 * @param int[optional] $orderId
	 * @return array
	 */
	public function getReviewWQOrders($orderId=0, $start = 0, $limit = 25, $sort = '', $dir = 'ASC')
	{
		$db = $this->getAdapter();
		$this->totalWQOrders = 0;

		$whereClause = "";
		if ($orderId > 0) {
		    $whereClause = $db->quoteInto('AND recon_ord_ID_int = ?', $orderId);
		}

		$orderby = " IF(LOANOFFICER_ORG_NAME  LIKE '%SPO%' OR CUSTOM5  LIKE '%SPO%',0,1)";
		$orderby .= ',recon_Priority_enum ASC,recon_ID_int ASC';
		if (strlen($sort) > 0) {
			$orderby = "{$sort} {$dir}";
		}

		$sql = "SELECT SQL_CALC_FOUND_ROWS
				deq_ID_int,
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_date AS reconpriorbpo2_review_date,
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_vendor_char AS reconpriorbpo2_review_vendor_char,
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_access_enum AS reconpriorbpo2_review_access_enum,
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_90_as_is_int AS reconpriorbpo2_review_90_as_is_int,
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_90_as_rep_int AS reconpriorbpo2_review_90_as_rep_int,
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_assessment_enum AS reconpriorbpo2_review_assessment_enum,
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_notes_text AS reconpriorbpo2_review_notes,
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_comment_char AS reconpriorbpo2_review_comment,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_compdst AS reconpriorbpo2_assmt_compdst,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_inapprrprcnsd AS reconpriorbpo2_assmt_inapprrprcnsd,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_conclunspt AS reconpriorbpo2_assmt_conclunspt,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_sjbimprinacr AS reconpriorbpo2_assmt_sjbimprinacr,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_inapprcmps AS reconpriorbpo2_assmt_inapprcmps,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_sbjhstinacabs AS reconpriorbpo2_assmt_sbjhstinacabs,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_dtdcmps AS reconpriorbpo2_assmt_dtdcmps,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_sjbcndinac AS reconpriorbpo2_assmt_sjbcndinac,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_inaclstpr AS reconpriorbpo2_assmt_inaclstpr,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_incabsphts AS reconpriorbpo2_assmt_incabsphts,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_inadexpl AS reconpriorbpo2_assmt_inadexpl,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_sbjstinflinac AS reconpriorbpo2_assmt_sbjstinflinac,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_incsbjprop AS reconpriorbpo2_assmt_incsbjprop,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_slsfacts AS reconpriorbpo2_assmt_slsfacts,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_sjbglainac AS reconpriorbpo2_assmt_sjbglainac,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_date AS reconpriorbpo3_review_date,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_vendor_char AS reconpriorbpo3_review_vendor_char,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_access_enum AS reconpriorbpo3_review_access_enum,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_90_as_is_int AS reconpriorbpo3_review_90_as_is_int,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_90_as_rep_int AS reconpriorbpo3_review_90_as_rep_int,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_assessment_enum AS reconpriorbpo3_review_assessment_enum,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_notes_text AS reconpriorbpo3_review_notes,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_comment_char AS reconpriorbpo3_review_comment,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_compdst AS reconpriorbpo3_assmt_compdst,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_inapprrprcnsd AS reconpriorbpo3_assmt_inapprrprcnsd,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_conclunspt AS reconpriorbpo3_assmt_conclunspt,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_sjbimprinacr AS reconpriorbpo3_assmt_sjbimprinacr,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_inapprcmps AS reconpriorbpo3_assmt_inapprcmps,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_sbjhstinacabs AS reconpriorbpo3_assmt_sbjhstinacabs,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_dtdcmps AS reconpriorbpo3_assmt_dtdcmps,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_sjbcndinac AS reconpriorbpo3_assmt_sjbcndinac,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_inaclstpr AS reconpriorbpo3_assmt_inaclstpr,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_incabsphts AS reconpriorbpo3_assmt_incabsphts,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_inadexpl AS reconpriorbpo3_assmt_inadexpl,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_sbjstinflinac AS reconpriorbpo3_assmt_sbjstinflinac,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_incsbjprop AS reconpriorbpo3_assmt_incsbjprop,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_slsfacts AS reconpriorbpo3_assmt_slsfacts,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_sjbglainac AS reconpriorbpo3_assmt_sjbglainac,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_date AS reconpriorbpo4_review_date,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_vendor_char AS reconpriorbpo4_review_vendor_char,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_access_enum AS reconpriorbpo4_review_access_enum,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_90_as_is_int AS reconpriorbpo4_review_90_as_is_int,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_90_as_rep_int AS reconpriorbpo4_review_90_as_rep_int,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_assessment_enum AS reconpriorbpo4_review_assessment_enum,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_notes_text AS reconpriorbpo4_review_notes,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_comment_char AS reconpriorbpo4_review_comment,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_compdst AS reconpriorbpo4_assmt_compdst,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_inapprrprcnsd AS reconpriorbpo4_assmt_inapprrprcnsd,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_conclunspt AS reconpriorbpo4_assmt_conclunspt,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_sjbimprinacr AS reconpriorbpo4_assmt_sjbimprinacr,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_inapprcmps AS reconpriorbpo4_assmt_inapprcmps,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_sbjhstinacabs AS reconpriorbpo4_assmt_sbjhstinacabs,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_dtdcmps AS reconpriorbpo4_assmt_dtdcmps,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_sjbcndinac AS reconpriorbpo4_assmt_sjbcndinac,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_inaclstpr AS reconpriorbpo4_assmt_inaclstpr,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_incabsphts AS reconpriorbpo4_assmt_incabsphts,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_inadexpl AS reconpriorbpo4_assmt_inadexpl,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_sbjstinflinac AS reconpriorbpo4_assmt_sbjstinflinac,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_incsbjprop AS reconpriorbpo4_assmt_incsbjprop,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_slsfacts AS reconpriorbpo4_assmt_slsfacts,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_sjbglainac AS reconpriorbpo4_assmt_sjbglainac,

				recon_reconciliationorder_tbl.*,
				reconvalarc_valuationarchive_tbl.*,
				reconrmvvio_reconrmvviolations_tbl.*,
				reconrmvassmt_reconrmvassess_tbl.*,
				reconrpradd_reconrepairaddendum_tbl.*,
				rmv_reconciledmarketvalue_tbl.*,
				reconvalarcexc_valuationarchiveexceptions_tbl.*,

				reconobsinfl_.*,

				IF(LOANOFFICER_ORG_NAME LIKE '%SPO%' || CUSTOM5 LIKE '%SPO%',1,0) AS is_spo

				FROM recon_reconciliationorder_tbl
				 JOIN reconvalarc_valuationarchive_tbl ON reconvalarc_recon_ID_int = recon_ID_int
				 LEFT JOIN reconobsinfl_reconobservedinfluences_tbl reconobsinfl_ ON recon_ID_int = reconobsinfl_recon_ID_int
				 LEFT JOIN xmldb_fnc.PUSHORDER_ORDER_tbl ON recon_ord_ID_int = PUSHORDER_ORDER_ord_ID_int
				 LEFT JOIN reconrmvvio_reconrmvviolations_tbl ON recon_ID_int = reconrmvvio_reconid_int 
				 LEFT JOIN reconrmvassmt_reconrmvassess_tbl ON recon_ID_int = reconrmvassmt_reconid_int
				 LEFT JOIN reconrpradd_reconrepairaddendum_tbl ON recon_ID_int = reconrpradd_reconid_int
				 LEFT JOIN rmv_reconciledmarketvalue_tbl ON recon_ID_int = rmv_recon_ID_int
				 LEFT JOIN reconvalarcexc_valuationarchiveexceptions_tbl ON reconvalarc_ID_int = reconvalarcexc_reconvalarc_ID_int
				 LEFT JOIN reconpriorbpo_priorbporeview_tbl reconpriorbpo2_
				  ON reconpriorbpo2_.reconpriorbpo_rmv_recon_ID_int = recon_reconciliationorder_tbl.recon_ID_int AND reconpriorbpo2_.reconpriorbpo_prior_bpo_file_type_char = 'BPO 2'
				 LEFT JOIN reconpriorbpo_priorbporeview_tbl reconpriorbpo3_
				  ON reconpriorbpo3_.reconpriorbpo_rmv_recon_ID_int = recon_reconciliationorder_tbl.recon_ID_int AND reconpriorbpo3_.reconpriorbpo_prior_bpo_file_type_char = 'BPO 3'
				 LEFT JOIN reconpriorbpo_priorbporeview_tbl reconpriorbpo4_
				  ON reconpriorbpo4_.reconpriorbpo_rmv_recon_ID_int = recon_reconciliationorder_tbl.recon_ID_int AND reconpriorbpo4_.reconpriorbpo_prior_bpo_file_type_char = 'BPO 4'


				 LEFT JOIN deq_rmv_tbl ON recon_ID_int = deq_recon_ID_int

				WHERE
                recon_Status_char IN (
                	SELECT reconsts_ReconciliationOrderStatus_char
    				FROM reconcil.reconsts_reconciliationorderstatus_tbl
    				JOIN evsmysql.wrkflmodsts_workflowmodulestatus_tbl
    					ON wrkflmodsts_ordsts_ESOrderStatus_varchar = reconsts_ord_sts_char
    				WHERE wrkflmodsts_WorkFlowModule_char = 'queues_review'
    		    )
                AND (
                    (reconvalarc_DestVendor_char = :companyAbbr OR 0=:companyId) OR
                    ('ES' = :companyAbbr AND reconvalarc_DestVendor_char = 'IVG') -- New use case where ES can see IVG orders
                )
                {$whereClause}
            ORDER BY
                {$orderby}

			LIMIT {$start},{$limit}";

		//Zend_Registry::get('logsql')->info(__METHOD__ . "::$username::\n" . $sql);
		$companyInfo = Default_Model_Company::getCurrentUserCompany();
	
		$data = $db->fetchAll(
            $sql,
		    array(
                ':companyAbbr' => $companyInfo['abbreviation'],
                ':companyId'   => $companyInfo['id']
	        )
		);

		$rs = $db->fetchCol('SELECT FOUND_ROWS()');
		$this->totalWQOrders = $rs[0];
		return $data;
	}


	/**
	 * Get unsumitted orders
	 *
	 * Used by the RMV Summary page to determine which orders need to be
	 * submitted.
	 *
     * @param int $reconId
     * @param int $bFNCOnly     Is this an FNC order
	 * @return array
	 */
	public function getUnsubmittedOrders($reconId, $bFNCOnly=0, $force=false)
	{
		

		$db = $this->getAdapter();

		$reconId  = (is_numeric($reconId)) ? intval($reconId) : 'NULL';
		$userId   = Zend_Auth::getInstance()->getIdentity()->reconusr_Login_char;
        $bFNCOnly = ($bFNCOnly) ? 1 : 0;

        if ($force) {
            $userId = 'FORCE_RESULT';
        }

        $sql = "CALL usp_GetNextRMVResult('{$userId}', $reconId, $bFNCOnly)";

        $result = $db->fetchAll($sql, array(), Zend_Db::FETCH_ASSOC);
		//$logger->info("RESULT: ".print_r($result,true) );

        if (count($result[0]) == 1) {
            return array();
        }

        $reconId = $result[0]['recon_ID_int'];

        if (!$reconId) {
            return array();
        }

        // Get Adjustments
        $adjustments = $db->fetchAll(
        	"CALL usp_get_rmvadjustments($reconId)",
        	Zend_Db::FETCH_ASSOC
        );

        $compAdjs = array(
        	1 => 1,
        	2 => 1,
        	3 => 1
        );

        foreach($adjustments as $adj) {
        	$compNum    = (int) $adj['CompNumber_int'];
        	$compAdjNum = $compAdjs[$compNum];

            // cmp1_adj1_label
            // cmp1_adj1_value
        	$result[0]["cmp" . $compNum . "_adj" . $compAdjNum . "_label"] = $adj['AdjustmentLabel_char'];
        	$result[0]["cmp" . $compNum . "_adj" . $compAdjNum . "_value"] = $adj['totaladj'];

        	$compAdjs[$compNum]++;
        }
        
        if ($bFNCOnly) {
            $files = new Default_Model_UploadFile();
            $result[0]['noAuditRmvIsMostRecent'] = $files->isNoAuditRmvMostRecentPriorRmv($result[0]['recon_ord_ID_int']);
            $result[0]['hasPriorRmv']            = $files->hasPriorRmv($result[0]['recon_ord_ID_int']);
            $result[0]['onlyHasPriorNoAuditRmv']        = $files->onlyHasPriorNoAuditRmv($result[0]['recon_ord_ID_int']);
        }
        else {
            $result[0]['noAuditRmvIsMostRecent'] = null;
            $result[0]['hasPriorRmv']            = null;
            $result[0]['onlyHasPriorNoAuditRmv'] = null;
        }
        

        return $result;
    }


    /**
     * Get the number of unsubmitted (un-delivered) orders
     *
     * @return int
     */
    public function getUnsubmittedOrdersCount($bFNCOnly = 0)
    {
			$db = $this->getAdapter();
			$userId = Zend_Auth::getInstance()->getIdentity()->reconusr_Login_char;
			$sql = "CALL usp_GetRMVResultCount('{$userId}',$bFNCOnly)";
			return $db->fetchOne($sql);
    }

    public function getRMVRetrievedResultsCount()
    {
        $db = $this->getAdapter();
        $sql = "
            SELECT COUNT(*)
            from  rmv_reconciledmarketvalue_tbl rmv
            JOIN  recon_reconciliationorder_tbl recon_
            ON    recon_.recon_ID_int = rmv.rmv_recon_ID_int

            JOIN act_actionlog_tbl act_rmv_submit_summary
            ON   act_rmv_submit_summary.act_recon_ID_int = recon_ID_int
            AND  act_rmv_submit_summary.act_reconaclmodact_ID_int = 2

            JOIN reconusr_reconuser_tbl
            ON   reconusr_ID_int = act_rmv_submit_summary.act_reconuser_ID_int

            JOIN reconvalarc_valuationarchive_tbl
            ON   reconvalarc_recon_ID_int = recon_ID_int
            WHERE
            recon_Status_char  IN ('Order Delivered')";

        return $db->fetchOne($sql);
    }

    public function getRMVRetrievedResults($limitParams=array())
    {
        $db = $this->getAdapter();
		$start = ($limitParams['start'])?$limitParams['start']:0;
        $limit = ($limitParams['limit'])?$limitParams['limit']:25;
        $sort = ($limitParams['sort'])?$limitParams['sort']:'act_rmv_submit_summary.act_inserted_datetime';
        $dir = ($limitParams['dir'])?$limitParams['dir']:'DESC';

        $sql = "SELECT
				rmv_recon_ID_int,
				reconvalarc_ID_int,
            	reconvalarc_LoanNumber_char,
            	reconvalarc_BorrowerFirstName_char,
            	reconvalarc_BorrowerLastName_char,
            	reconvalarc_PropertyStreet_char,
            	reconvalarc_PropertyCity_char,
            	reconvalarc_PropertyState_char,
            	reconvalarc_PropertyZip_char,
            	IF(reconvalarc_RMVShortForm_char='Yes','Short Form','Long Form') AS
 reconvalarc_RMVShortForm_char,
            	reconvalarc_LoanType_char,
            	reconusr_CustomField1_char,
             	reconusr_Name_char,
            	act_rmv_submit_summary.act_inserted_datetime,
				reconvalarc_DestVendor_char,
				reconvalarc_B1_Fortracs_char
            FROM
            	rmv_reconciledmarketvalue_tbl rmv
            	JOIN  recon_reconciliationorder_tbl recon_
            	ON    recon_.recon_ID_int = rmv.rmv_recon_ID_int

            	JOIN act_actionlog_tbl act_rmv_submit_summary
            	ON   act_rmv_submit_summary.act_recon_ID_int = recon_ID_int
            	AND  act_rmv_submit_summary.act_reconaclmodact_ID_int = 2

            	JOIN reconusr_reconuser_tbl
            	ON   reconusr_ID_int = act_rmv_submit_summary.act_reconuser_ID_int

            	JOIN reconvalarc_valuationarchive_tbl
            	ON   reconvalarc_recon_ID_int = recon_ID_int
            WHERE
            	recon_Status_char  IN ('Order Delivered')
            ORDER BY {$sort} {$dir}
			LIMIT {$start}, {$limit}";

       return $db->fetchAll($sql);
    }

	public function getLoadedOrdersCount($reconUser)
	{
		$db = $this->getAdapter();
		$sql = "SELECT *
            	FROM reconvalarc_valuationarchive_tbl
				WHERE reconvalarc_UploadedBy_char = '{$reconUser}'";
		$orders = $db->fetchAll($sql);
		return count($orders);
	}

	public function getLoadedOrders($reconUser, $limitParams=array())
    {
        $db = $this->getAdapter();
		$start = ($limitParams['start'])?$limitParams['start']:0;
        $limit = ($limitParams['limit'])?$limitParams['limit']:25;
        $sort = ($limitParams['sort'])?$limitParams['sort']:'reconvalarc_Inserted_timestamp';
        $dir = ($limitParams['dir'])?$limitParams['dir']:'DESC';

        $sql = "SELECT
				reconvalarc_ID_int,
				reconvalarc_LoanNumber_char,
				reconvalarc_Borrower_char,
				reconvalarc_BorrowerFirstName_char,
				reconvalarc_BorrowerLastName_char,
				reconvalarc_PropertyStreet_char,
				reconvalarc_PropertyCity_char,
				reconvalarc_PropertyState_char,
				reconvalarc_PropertyZip_char,
				reconvalarc_OrigApprDate_date,
				reconvalarc_OrigApprValue_int,
				reconvalarc_LoanType_char,
				reconvalarc_Channel_char,
				reconvalarc_RMVShortForm_char,
				reconvalarc_Collat_char,
				reconvalarc_B1_Fortracs_char,
				reconvalarc_DestVendor_char,
				reconvalarc_Inserted_timestamp
			FROM reconvalarc_valuationarchive_tbl
			WHERE reconvalarc_UploadedBy_char = '{$reconUser}'
            ORDER BY {$sort} {$dir}
			LIMIT {$start}, {$limit}";

       return $db->fetchAll($sql);
    }

	public function getReconciledOrdersCount($reconUser, $limitParams=array())
	{
		$db = $this->getAdapter();

		$filter_wc = array( "recon_ReconciledBy_char = '{$reconUser}'" );
		$filter_hc = array();

		if ($limitParams['filters']) {
			 foreach ($limitParams['filters'] as $i => $farr) {
				 if ($farr['field'] == 'Pay Period') {
					 $filter_hc[] = "`Pay Period` like '%".$farr['data']['value']."%'";
				 }

			    if ($farr['field'] == 'recon_Reconciled_datetime') {
					if ($farr['data']['comparison'] == 'gt') {
					    $gt = date('Y-m-d',strtotime($farr['data']['value']));
					}
					if ($farr['data']['comparison'] == 'lt') {
					    $lt = date('Y-m-d',strtotime($farr['data']['value']));
					}
					if ($farr['data']['comparison'] == 'eq') {
					    $eq = date('Y-m-d',strtotime($farr['data']['value']));
					}
					if ($eq) {
						$filter_wc[] = "DATEDIFF(recon_Reconciled_datetime,'{$eq}') = 0";
					}
					else if ($gt && $lt) {
						$filter_wc[] = "(DATEDIFF(recon_Reconciled_datetime,'{$gt}') > 0 and DATEDIFF(recon_Reconciled_datetime,'{$lt}') < 0)";
					}
					else if ($gt) {
						$filter_wc[] = "DATEDIFF(recon_Reconciled_datetime,'{$gt}') > 0";
					}
					else if ($lt) {
						$filter_wc[] = "DATEDIFF(recon_Reconciled_datetime,'{$lt}') < 0";
					}
				}

				if ($farr['field'] == 'recon_Assigned_datetime') {
					if ($farr['data']['comparison'] == 'gt') {
					    $gt = date('Y-m-d',strtotime($farr['data']['value']));
					}
					if ($farr['data']['comparison'] == 'lt') {
					    $lt = date('Y-m-d',strtotime($farr['data']['value']));
					}
					if ($farr['data']['comparison'] == 'eq') {
					    $eq = date('Y-m-d',strtotime($farr['data']['value']));
					}
					if ($eq) {
						$filter_wc[] = "DATEDIFF(recon_Assigned_datetime,'{$eq}') = 0";
					}
					else if ($gt && $lt) {
						$filter_wc[] = "(DATEDIFF(recon_Assigned_datetime,'{$gt}') > 0 and DATEDIFF(recon_Reconciled_datetime,'{$lt}') < 0)";
					}
					else if ($gt) {
						$filter_wc[] = "DATEDIFF(recon_Assigned_datetime,'{$gt}') > 0";
					}
					else if ($lt) {
						$filter_wc[] = "DATEDIFF(recon_Assigned_datetime,'{$lt}') < 0";
					}
				}
			 }
		}
		$sql = "SELECT
				recon_ID_int,
				recon_ord_ID_int,
				recon_original_ord_ID_int,
				recon_Priority_enum,
				recon_Status_char,
				recon_LoanNumber_char,
				recon_Address_Street_char,
				recon_Address_Line2_char,
				recon_Address_City_char,
				recon_Address_State_char,
				recon_Address_Zip_char,
				recon_RequestPurpose_char
				recon_reconfreas_FailedReason_char,
				recon_Reconciled_datetime,
				recon_Assigned_datetime,
				(SELECT reconpayroll_Payroll_char FROM reconpayroll_contractorpayrollschedule_tbl WHERE recon_Reconciled_datetime BETWEEN reconpayroll_Start_date AND reconpayroll_End_date ) AS `Pay Period`,
				recon_reconfreas_FailedReason_char,
				IF(IFNULL(recon_payhist_Paid_date,'0000-00-00') > '0000-00-00', 'Y', 'N') AS Paid,
				TIMEDIFF(recon_Reconciled_datetime,recon_Assigned_datetime) as Time,
				reconvalarcexc_ID_int,
				TIMEDIFF(reconvalarcexc_Submitted_datetime,reconvalarcexc_Created_timestamp) as ExceptionTime
			FROM recon_reconciliationorder_tbl
			LEFT JOIN reconvalarc_valuationarchive_tbl
				ON recon_ID_int = reconvalarc_recon_ID_int
			LEFT JOIN reconvalarcexc_valuationarchiveexceptions_tbl
				ON reconvalarc_ID_int = reconvalarcexc_reconvalarc_ID_int
			LEFT JOIN recon_payhist_contactorpayrollhistory_tbl
				ON recon_ReconciledBy_char =  recon_payhist_reconusr_login_char
				AND recon_ord_ID_int = recon_payhist_ord_ID_int
				AND recon_ID_int = recon_payhist_recon_ID_int";
		if (count($filter_wc) > 0) {
			$sql .= " WHERE ".join(" AND ",$filter_wc);
		}
		if (count($filter_hc) > 0) {
			$sql .= " HAVING ".join(" AND ",$filter_hc);
		}
		$orders = $db->fetchAll($sql);
		return count($orders);
	}

    public function getReconciledOrders($reconUser, $limitParams=array())
    {
        $db = $this->getAdapter();
		  $start = ($limitParams['start'])?$limitParams['start']:0;
        $limit = ($limitParams['limit'])?$limitParams['limit']:50;
        $sort = ($limitParams['sort'])?$limitParams['sort']:'recon_Reconciled_datetime';
        $dir = ($limitParams['dir'])?$limitParams['dir']:'DESC';

		$filter_wc = array( "recon_ReconciledBy_char = '{$reconUser}'" );
		$filter_hc = array();
		if ($limitParams['filters']) {
			 foreach ($limitParams['filters'] as $i => $farr) {
				 if ($farr['field'] == 'Pay Period') {
					 $filter_hc[] = "`Pay Period` like '%".$farr['data']['value']."%'";
				 }

			    if ($farr['field'] == 'recon_Reconciled_datetime') {
					if ($farr['data']['comparison'] == 'gt') $gt = date('Y-m-d',strtotime($farr['data']['value']));
					if ($farr['data']['comparison'] == 'lt') $lt = date('Y-m-d',strtotime($farr['data']['value']));
					if ($farr['data']['comparison'] == 'eq') $eq = date('Y-m-d',strtotime($farr['data']['value']));
					if ($eq)
						$filter_wc[] = "DATEDIFF(recon_Reconciled_datetime,'{$eq}') = 0";
					else if ($gt && $lt)
						$filter_wc[] = "(DATEDIFF(recon_Reconciled_datetime,'{$gt}') > 0 and DATEDIFF(recon_Reconciled_datetime,'{$lt}') < 0)";
					else if ($gt)
						$filter_wc[] = "DATEDIFF(recon_Reconciled_datetime,'{$gt}') > 0";
					else if ($lt)
						$filter_wc[] = "DATEDIFF(recon_Reconciled_datetime,'{$lt}') < 0";
				}

				if ($farr['field'] == 'recon_Assigned_datetime') {
					if ($farr['data']['comparison'] == 'gt') $gt = date('Y-m-d',strtotime($farr['data']['value']));
					if ($farr['data']['comparison'] == 'lt') $lt = date('Y-m-d',strtotime($farr['data']['value']));
					if ($farr['data']['comparison'] == 'eq') $eq = date('Y-m-d',strtotime($farr['data']['value']));
					if ($eq)
						$filter_wc[] = "DATEDIFF(recon_Assigned_datetime,'{$eq}') = 0";
					else if ($gt && $lt)
						$filter_wc[] = "(DATEDIFF(recon_Assigned_datetime,'{$gt}') > 0 and DATEDIFF(recon_Reconciled_datetime,'{$lt}') < 0)";
					else if ($gt)
						$filter_wc[] = "DATEDIFF(recon_Assigned_datetime,'{$gt}') > 0";
					else if ($lt)
						$filter_wc[] = "DATEDIFF(recon_Assigned_datetime,'{$lt}') < 0";
				}
			 }
		}

        $sql = "SELECT
				recon_ID_int,
				recon_ord_ID_int,
				recon_original_ord_ID_int,
				recon_Priority_enum,
				recon_Status_char,
				recon_LoanNumber_char,
				recon_Address_Street_char,
				recon_Address_Line2_char,
				recon_Address_City_char,
				recon_Address_State_char,
				recon_Address_Zip_char,
				recon_RequestPurpose_char
				recon_reconfreas_FailedReason_char,
				recon_Reconciled_datetime,
				recon_Assigned_datetime,
				(SELECT reconpayroll_Payroll_char FROM reconpayroll_contractorpayrollschedule_tbl WHERE recon_Reconciled_datetime BETWEEN reconpayroll_Start_date AND reconpayroll_End_date ) AS `Pay Period`,
				recon_reconfreas_FailedReason_char,
				IF(IFNULL(recon_payhist_Paid_date,'0000-00-00') > '0000-00-00', 'Y', 'N') AS Paid,
				TIMEDIFF(recon_Reconciled_datetime,recon_Assigned_datetime) as Time,
				reconvalarcexc_ID_int,
				TIMEDIFF(reconvalarcexc_Submitted_datetime,reconvalarcexc_Created_timestamp) as ExceptionTime
			FROM recon_reconciliationorder_tbl
			LEFT JOIN reconvalarc_valuationarchive_tbl
				ON recon_ID_int = reconvalarc_recon_ID_int
			LEFT JOIN reconvalarcexc_valuationarchiveexceptions_tbl
				ON reconvalarc_ID_int = reconvalarcexc_reconvalarc_ID_int
			LEFT JOIN recon_payhist_contactorpayrollhistory_tbl
				ON recon_ReconciledBy_char =  recon_payhist_reconusr_login_char
				AND recon_ord_ID_int = recon_payhist_ord_ID_int
				AND recon_ID_int = recon_payhist_recon_ID_int";
		if (count($filter_wc) > 0) {
			$sql .= " WHERE ".join(" AND ",$filter_wc);
		}
		if (count($filter_hc) > 0) {
			$sql .= " HAVING ".join(" AND ",$filter_hc);
		}
		$sql .= " ORDER BY {$sort} {$dir}";
		$sql .= " LIMIT {$start}, {$limit}";

		//$writer = new Zend_Log_Writer_Stream(dirname(__FILE__).'/../../logs/debug.log');
		//$logger = new Zend_Log($writer);
		//$logger->info('SQL: '.$sql);

		return $db->fetchAll($sql);
    }


    /**
     * Unlock order
     *
     * Manually unlock an order by setting its timeout to a date in the past.
     *
     * @param int $reconId
     */
    public function unlockOrder($reconId)
    {
        $sql = "
            UPDATE rmvreslc_resultarchivelock_tbl
            SET rmvreslc_LockTimeout_datetime = '2009-01-01 00:00:00'
            WHERE rmvreslc_recon_ID_int = ?";

        return $this->getAdapter()->query($sql, $reconId);
    }



    /**
     * Get a WorkQueue order
     *
     * @param int $id Order Id
     * @return array
     */
	function getWQOrders($id)
	{
		$db = $this->getAdapter();

		$sql = "SELECT
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_date AS reconpriorbpo2_review_date,
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_vendor_char AS reconpriorbpo2_review_vendor_char,
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_access_enum AS reconpriorbpo2_review_access_enum,
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_90_as_is_int AS reconpriorbpo2_review_90_as_is_int,
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_90_as_rep_int AS reconpriorbpo2_review_90_as_rep_int,
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_assessment_enum AS reconpriorbpo2_review_assessment_enum,
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_notes_text AS reconpriorbpo2_review_notes,
				reconpriorbpo2_.reconpriorbpo_rmv_bpo_review_comment_char AS reconpriorbpo2_review_comment,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_compdst AS reconpriorbpo2_assmt_compdst,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_inapprrprcnsd AS reconpriorbpo2_assmt_inapprrprcnsd,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_conclunspt AS reconpriorbpo2_assmt_conclunspt,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_sjbimprinacr AS reconpriorbpo2_assmt_sjbimprinacr,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_inapprcmps AS reconpriorbpo2_assmt_inapprcmps,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_sbjhstinacabs AS reconpriorbpo2_assmt_sbjhstinacabs,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_dtdcmps AS reconpriorbpo2_assmt_dtdcmps,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_sjbcndinac AS reconpriorbpo2_assmt_sjbcndinac,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_inaclstpr AS reconpriorbpo2_assmt_inaclstpr,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_incabsphts AS reconpriorbpo2_assmt_incabsphts,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_inadexpl AS reconpriorbpo2_assmt_inadexpl,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_sbjstinflinac AS reconpriorbpo2_assmt_sbjstinflinac,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_incsbjprop AS reconpriorbpo2_assmt_incsbjprop,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_slsfacts AS reconpriorbpo2_assmt_slsfacts,
				reconpriorbpo2_.reconpriorbpo_reconrmvassmt_sjbglainac AS reconpriorbpo2_assmt_sjbglainac,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_date AS reconpriorbpo3_review_date,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_vendor_char AS reconpriorbpo3_review_vendor_char,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_access_enum AS reconpriorbpo3_review_access_enum,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_90_as_is_int AS reconpriorbpo3_review_90_as_is_int,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_90_as_rep_int AS reconpriorbpo3_review_90_as_rep_int,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_assessment_enum AS reconpriorbpo3_review_assessment_enum,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_notes_text AS reconpriorbpo3_review_notes,
				reconpriorbpo3_.reconpriorbpo_rmv_bpo_review_comment_char AS reconpriorbpo3_review_comment,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_compdst AS reconpriorbpo3_assmt_compdst,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_inapprrprcnsd AS reconpriorbpo3_assmt_inapprrprcnsd,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_conclunspt AS reconpriorbpo3_assmt_conclunspt,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_sjbimprinacr AS reconpriorbpo3_assmt_sjbimprinacr,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_inapprcmps AS reconpriorbpo3_assmt_inapprcmps,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_sbjhstinacabs AS reconpriorbpo3_assmt_sbjhstinacabs,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_dtdcmps AS reconpriorbpo3_assmt_dtdcmps,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_sjbcndinac AS reconpriorbpo3_assmt_sjbcndinac,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_inaclstpr AS reconpriorbpo3_assmt_inaclstpr,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_incabsphts AS reconpriorbpo3_assmt_incabsphts,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_inadexpl AS reconpriorbpo3_assmt_inadexpl,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_sbjstinflinac AS reconpriorbpo3_assmt_sbjstinflinac,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_incsbjprop AS reconpriorbpo3_assmt_incsbjprop,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_slsfacts AS reconpriorbpo3_assmt_slsfacts,
				reconpriorbpo3_.reconpriorbpo_reconrmvassmt_sjbglainac AS reconpriorbpo3_assmt_sjbglainac,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_date AS reconpriorbpo4_review_date,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_vendor_char AS reconpriorbpo4_review_vendor_char,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_access_enum AS reconpriorbpo4_review_access_enum,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_90_as_is_int AS reconpriorbpo4_review_90_as_is_int,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_90_as_rep_int AS reconpriorbpo4_review_90_as_rep_int,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_assessment_enum AS reconpriorbpo4_review_assessment_enum,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_notes_text AS reconpriorbpo4_review_notes,
				reconpriorbpo4_.reconpriorbpo_rmv_bpo_review_comment_char AS reconpriorbpo4_review_comment,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_compdst AS reconpriorbpo4_assmt_compdst,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_inapprrprcnsd AS reconpriorbpo4_assmt_inapprrprcnsd,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_conclunspt AS reconpriorbpo4_assmt_conclunspt,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_sjbimprinacr AS reconpriorbpo4_assmt_sjbimprinacr,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_inapprcmps AS reconpriorbpo4_assmt_inapprcmps,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_sbjhstinacabs AS reconpriorbpo4_assmt_sbjhstinacabs,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_dtdcmps AS reconpriorbpo4_assmt_dtdcmps,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_sjbcndinac AS reconpriorbpo4_assmt_sjbcndinac,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_inaclstpr AS reconpriorbpo4_assmt_inaclstpr,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_incabsphts AS reconpriorbpo4_assmt_incabsphts,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_inadexpl AS reconpriorbpo4_assmt_inadexpl,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_sbjstinflinac AS reconpriorbpo4_assmt_sbjstinflinac,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_incsbjprop AS reconpriorbpo4_assmt_incsbjprop,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_slsfacts AS reconpriorbpo4_assmt_slsfacts,
				reconpriorbpo4_.reconpriorbpo_reconrmvassmt_sjbglainac AS reconpriorbpo4_assmt_sjbglainac,

				recon_reconciliationorder_tbl.*,
				reconvalarc_valuationarchive_tbl.*,
				reconrmvvio_reconrmvviolations_tbl.*,
				reconrmvassmt_reconrmvassess_tbl.*,
				reconrpradd_reconrepairaddendum_tbl.*,
				rmv_reconciledmarketvalue_tbl.*,
				reconobsinfl_.*,
				reconvalarcexc_valuationarchiveexceptions_tbl.*,
				realquestpro_files_tbl.realquestpro_compDetail_req as realquestpro_compDetail_req,
				IF(LOANOFFICER_ORG_NAME LIKE '%SPO%' || CUSTOM5 LIKE '%SPO%',1,0) AS is_spo
				FROM recon_reconciliationorder_tbl
				JOIN reconvalarc_valuationarchive_tbl ON reconvalarc_recon_ID_int = recon_ID_int
				LEFT JOIN reconobsinfl_reconobservedinfluences_tbl reconobsinfl_ ON recon_ID_int = reconobsinfl_recon_ID_int
				left join realquestpro_files_tbl using(recon_ord_ID_int)
				LEFT JOIN xmldb_fnc.PUSHORDER_ORDER_tbl ON recon_ord_ID_int = PUSHORDER_ORDER_ord_ID_int 
				LEFT JOIN reconrmvvio_reconrmvviolations_tbl ON recon_ID_int = reconrmvvio_reconid_int
				LEFT JOIN reconrmvassmt_reconrmvassess_tbl ON recon_ID_int = reconrmvassmt_reconid_int
				LEFT JOIN reconrpradd_reconrepairaddendum_tbl ON recon_ID_int = reconrpradd_reconid_int
				LEFT JOIN rmv_reconciledmarketvalue_tbl ON recon_ID_int = rmv_recon_ID_int
				LEFT JOIN reconvalarcexc_valuationarchiveexceptions_tbl ON reconvalarc_ID_int = reconvalarcexc_reconvalarc_ID_int 
				LEFT JOIN reconpriorbpo_priorbporeview_tbl reconpriorbpo2_
				  ON reconpriorbpo2_.reconpriorbpo_rmv_recon_ID_int = recon_reconciliationorder_tbl.recon_ID_int AND reconpriorbpo2_.reconpriorbpo_prior_bpo_file_type_char = 'BPO 2'
				LEFT JOIN reconpriorbpo_priorbporeview_tbl reconpriorbpo3_
				  ON reconpriorbpo3_.reconpriorbpo_rmv_recon_ID_int = recon_reconciliationorder_tbl.recon_ID_int AND reconpriorbpo3_.reconpriorbpo_prior_bpo_file_type_char = 'BPO 3'
				LEFT JOIN reconpriorbpo_priorbporeview_tbl reconpriorbpo4_
                    ON reconpriorbpo4_.reconpriorbpo_rmv_recon_ID_int = recon_reconciliationorder_tbl.recon_ID_int AND reconpriorbpo4_.reconpriorbpo_prior_bpo_file_type_char = 'BPO 4'


				WHERE
				    recon_ord_ID_int = :orderId AND
				    (
				        (reconvalarc_DestVendor_char = :companyAbbr OR '0'=:companyId) OR
				        ('ES' = :companyAbbr AND reconvalarc_DestVendor_char = 'IVG')
				    )";

		$companyInfo = Default_Model_Company::getCurrentUserCompany();
		//Zend_Registry::get('logdebug')->info('getWQOrders:companyInfo ' . print_r($companyInfo,true));

        $data = $db->fetchAll(
            $sql,
            array(
                ':orderId'      => $id,
                ':companyAbbr'  => $companyInfo['abbreviation'],
                ':companyId'    => $companyInfo['id']
            )
        );

		return $data;
	}



	/**
	 * Get manage work queue orders
	 *
	 * @param string $sortby
	 * @param string $dir
	 * @param unknown_type $filter
	 * @return unknown
	 */
	function getManageWorkqueueOrders($sortby, $dir, $filter=NULL, $start = 0, $limit = 25)
	{
		$db = $this->getAdapter();

		// Get basic information about the current user's company
		$companyInfo = Default_Model_Company::getCurrentUserCompany();

		$sql = "
            SELECT SQL_CALC_FOUND_ROWS
	 		recon_reconciliationorder_tbl.*,
			reconvalarcexc_ID_int,reconvalarcexc_Status_enum,reconvalarc_DestVendor_char,
			IF(recon_FNC_Folder_Num_varchar IS NULL,'RMV','CMS') AS Source,
			IF(reconvalarc_RMVShortForm_char='No','Long','Short') AS FormType,
			IF(LOANOFFICER_ORG_NAME  LIKE '%SPO%' OR CUSTOM5  LIKE '%SPO%','SPO','') AS SPO
		  FROM recon_reconciliationorder_tbl
		    JOIN reconvalarc_valuationarchive_tbl ON
			reconvalarc_recon_ID_int = recon_ID_int
		    JOIN co_company_tbl ON
			co_abbreviation_char = reconvalarc_DestVendor_char
			LEFT JOIN xmldb_fnc.PUSHORDER_ORDER_tbl ON recon_ord_ID_int = PUSHORDER_ORDER_ord_ID_int

		    LEFT JOIN reconvalarcexc_valuationarchiveexceptions_tbl ON
			reconvalarcexc_reconvalarc_ID_int = reconvalarc_ID_int";

        $filter_wc = array(
            " recon_Status_char NOT IN('Order Canceled', 'Approved','Order Delivered')",
            " (( co_ID_int = '{$companyInfo['id']}' OR '0'='{$companyInfo['id']}') OR ('ES' = '{$companyInfo['abbreviation']}' AND reconvalarc_DestVendor_char = 'IVG')) "
        );

		if ($filter) {
		    $filter_wc = array();

		    // Filter orders by company
		    $filter_wc[] = " ( reconvalarc_DestVendor_char = '{$companyInfo['abbreviation']}' OR 0={$companyInfo['id']})";

		    foreach ($filter as $i => $farr) {
		    	if ($farr['field'] == 'recon_ord_ID_int') {
			        $filter_wc[] = "recon_ord_ID_int = " . $db->quote($farr['data']['value']);
				}

			    if ($farr['field'] == 'recon_AssignedTo_char') {
			        $filter_wc[] = "recon_AssignedTo_char like ".$db->quote($farr['data']['value'].'%');
				}

				if ($farr['field'] == 'recon_Priority_enum') {
					$arr = split(",",$farr['data']['value']);
					$wc = array();
					foreach($arr as $v) {
						$wc[] = $db->quote($v);
					}
			        $filter_wc[] = "recon_Priority_enum in ( ".join(",",$wc).')';
				}

				if ($farr['field'] == 'recon_ID_int') {
					if ($farr['data']['comparison'] == 'gt') $gt = $farr['data']['value'];
					if ($farr['data']['comparison'] == 'lt') $lt = $farr['data']['value'];
					if ($farr['data']['comparison'] == 'eq') $eq = $farr['data']['value'];
					if ($eq)
						$filter_wc[] = "recon_ID_int = {$eq}";
					else if ($gt && $lt)
						$filter_wc[] = "recon_ID_int between {$gt} and {$lt}";
					else if ($gt)
						$filter_wc[] = "recon_ID_int > {$gt}";
					else if ($lt)
						$filter_wc[] = "recon_ID_int < {$lt}";
				}

				if ($farr['field'] == 'recon_Address_Street_char') {
					$filter_wc[] = "recon_Address_Street_char like ".$db->quote($farr['data']['value'].'%');
				}

				if ($farr['field'] == 'recon_Address_City_char') {
					$filter_wc[] = "recon_Address_City_char like ".$db->quote($farr['data']['value'].'%');
				}

				if ($farr['field'] == 'recon_Address_State_char') {
					$filter_wc[] = "recon_Address_State_char like ".$db->quote($farr['data']['value'].'%');
				}

				if ($farr['field'] == 'recon_Address_Zip_char') {
					$filter_wc[] = "recon_Address_Zip_char like ".$db->quote($farr['data']['value'].'%');
				}

				if ($farr['field'] == 'recon_Status_char') {
					$filter_wc[] = "recon_Status_char like ".$db->quote($farr['data']['value'].'%');
				}

				if ($farr['field'] == 'recon_LoanNumber_char') {
					$filter_wc[] = "recon_LoanNumber_char like ".$db->quote($farr['data']['value'].'%');
				}

				if ($farr['field'] == 'recon_Loaded_datetime') {
					if ($farr['data']['comparison'] == 'gt') $gt = date('Y-m-d',strtotime($farr['data']['value']));
					if ($farr['data']['comparison'] == 'lt') $lt = date('Y-m-d',strtotime($farr['data']['value']));
					if ($farr['data']['comparison'] == 'eq') $eq = date('Y-m-d',strtotime($farr['data']['value']));
					if ($eq)
						$filter_wc[] = "DATEDIFF(recon_Loaded_datetime,'{$eq}') = 0";
					else if ($gt && $lt)
						$filter_wc[] = "(DATEDIFF(recon_Loaded_datetime,'{$gt}') > 0 and DATEDIFF(recon_Loaded_datetime,'{$lt}') < 0)";
					else if ($gt)
						$filter_wc[] = "DATEDIFF(recon_Loaded_datetime,'{$gt}') > 0";
					else if ($lt)
						$filter_wc[] = "DATEDIFF(recon_Loaded_datetime,'{$lt}') < 0";
				}

				// this filter slows down query - bad indexing
				/*if ($farr['field'] == 'FormType') {
					switch ($farr['data']['value']) {
						case 'Short':
							$filter_wc[] = " reconvalarc_RMVShortForm_char = 'Yes' ";
							break;

						case 'Long':
							$filter_wc[] = " reconvalarc_RMVShortForm_char = 'No' ";
							break;
					}

				}*/
			}
		}

		if (count($filter_wc) > 0) {
			$sql .= " where ".join(" and ",$filter_wc);
		}

		$sql .= " order by {$sortby} {$dir}, recon_ID_int ASC";
		if ($limit > 0) {
			$sql .= " limit {$start},{$limit}";
		}
		Zend_Registry::get('logsql')->info(__METHOD__ . '::' . $sql);
		$data = $db->fetchAll($sql);
		$rs = $db->fetchCol('SELECT FOUND_ROWS()');
		$this->totalManagedOrders = $rs[0];
		return $data;
	}

	public function updateQueue($data, $id)
	{
		$db = $this->getAdapter();
		$where = $db->quoteInto('recon_ID_int = ?', $id);
		return $db->update('recon_reconciliationorder_tbl', $data, $where);
	}

	function saveChanges($post) {
		$db = $this->getAdapter();
		//$writer = new Zend_Log_Writer_Stream(dirname(__FILE__).'/../../logs/debug.log');
		//$logger = new Zend_Log($writer);
		//$logger->info("save wq changes : ".print_r($post,true));

		foreach ($post as $i => $arr) {
			$arr2 = Zend_Json::decode($arr);
			$data = array(
				'recon_Priority_enum' => $arr2['recon_Priority_enum'],
				'recon_AssignedTo_char' => $arr2['recon_AssignedTo_char']
			);

			//$logger->info("save wq data : ". print_r($data,true) );

			$where = 'recon_ID_int = '. $arr2['recon_ID_int'];

			$db->update($this->_name,$data,$where);
		}
	}



	public function getStatusByReconId($reconId)
	{
	    $sql = "
            SELECT
                recon_Status_char
            FROM recon_reconciliationorder_tbl
            WHERE
                recon_ID_int = ?";

	    return $this->getAdapter()->fetchOne($sql, $reconId);
	}


	public function getOrderIdByReconId($reconId)
	{
	   $sql = "
	       SELECT
	           recon_ord_ID_int
	       FROM recon_reconciliationorder_tbl
           WHERE
               recon_ID_int = ?";

	   return $this->getAdapter()->fetchOne($sql, $reconId);
	}



	public function getStatusByOrderId($esOrderId)
	{
	    $sql = "
	       SELECT
	           recon_Status_char
	       FROM recon_reconciliationorder_tbl
           WHERE
               recon_ord_ID_int = ?";

	   return $this->getAdapter()->fetchOne($sql, $esOrderId);
	}


	/**
	 * Update Order Status
	 *
	 * @throws Exception if invalid status name provided
	 * @param int    $reconId
	 * @param string $newStatus
	 * @return int
	 */
	public function updateStatus($reconId, $newStatus)
	{
	    $validStatuses = array(
	       'Assigned',
	       'Draft Saved',
	       'Loaded',
	       'Not Started',
	       'Reconciled',
	       'Submitted',
	       'Order Delivered',
	       'RMV Rejected'
	    );

	    if (!in_array($newStatus, $validStatuses)) {
	        throw new Exception("Cannot change order to status '{$newStatus}'.  Only these status types allowed: " . implode(', ', $validStatuses));
	    }

	    $data = array('recon_Status_char' => $newStatus);

        $where = $this->getAdapter()->quoteInto('recon_ID_int = ?', $reconId);

        return $this->update($data, $where);
	}

	public function getExceptionsReasons($row)
	{
		if (!is_array($row) OR count($row) < 1) {
			return '';
		}

		$reasons = '';
		$glue = '';

		if ($row['reconvalarcexc_MissingLoan_int'] > 0) {
			$reasons .= $glue . 'Missing Loan Number';
			$glue = ',';
		}
		if ($row['reconvalarcexc_MissingCustomer_int'] > 0) {
			$reasons .= $glue . 'Missing Customer';
			$glue = ',';
		}
		if ($row['reconvalarcexc_MissingAddress_int'] > 0) {
			$reasons .= $glue . 'Missing Address';
			$glue = ',';
		}
		if ($row['reconvalarcexc_MissingCity_int'] > 0) {
			$reasons .= $glue . 'Missing City';
			$glue = ',';
		}
		if ($row['reconvalarcexc_MissingState_int'] > 0) {
			$reasons .= $glue . 'Missing State';
			$glue = ',';
		}
		if ($row['reconvalarcexc_MissingZip_int'] > 0) {
			$reasons .= $glue . 'Missing Zip';
			$glue = ',';
		}
		if ($row['reconvalarcexc_MissingOrigDate_int'] > 0) {
			$reasons .= $glue . 'Missing Orig Date';
			$glue = ',';
		}
		if ($row['reconvalarcexc_MissingOrigApprVal_int'] > 0) {
			$reasons .= $glue . 'Missing Orig Appraisal Value';
			$glue = ',';
		}
		if ($row['reconvalarcexc_LoanType_int'] > 0) {
			$reasons .= $glue . 'Missing Loan Type';
			$glue = ',';
		}
		if ($row['reconvalarcexc_Channel_int'] > 0) {
			$reasons .= $glue . 'Missing Channel';
			$glue = ',';
		}
		if ($row['reconvalarcexc_RMVShortForm_int'] > 0) {
			$reasons .= $glue . 'RMV Short Form';
			$glue = ',';
		}
		if ($row['reconvalarcexc_OriginalAppraisalFileMissing_int'] > 0) {
			$reasons .= $glue . 'Original Appraisal File Missing';
			$glue = ',';
		}
		if ($row['reconvalarcexc_MostRecentBPOMissing_int'] > 0) {
			$reasons .= $glue . 'Most Recent BPO Missing';
			$glue = ',';
		}
		if ($row['reconvalarcexc_OriginalAppraisalAddressInconsistent_int'] > 0) {
			$reasons .= $glue . 'Original Appraisal Address Inconsistent';
			$glue = ',';
		}
		if ($row['reconvalarcexc_MostRecentBPOAddressInconsistent_int'] > 0) {
			$reasons .= $glue . 'Most Recent BPO Address Inconsistent';
			$glue = ',';
		}

		return $reasons;
	}



	public function getReconIdByOrderId($orderId)
	{
	   $sql = "
	       SELECT
	           recon_ID_int
	       FROM recon_reconciliationorder_tbl
           WHERE
               recon_ord_ID_int = ?";

	   return $this->getAdapter()->fetchOne($sql, $orderId);
	}



	/**
     * Is order assigned to user id?
     *
     * @param int $reconId  Recon order id
     * @param int[optional] $userId Optional user if.  If not provided the
     *  current session user id is used.
     * @return bool
     */
    public function reconIsAssignedToUserId($reconId, $userId=null)
    {
        // No user id provided, use current session user
        if (!is_numeric($userId)) {
            // If not logged in, cannot be assigned this order
            if (!Zend_Auth::getInstance()->hasIdentity()) {
                return false;
            }
            $userId = Zend_Auth::getInstance()->getIdentity()->reconusr_ID_int;
        }

        if (!is_numeric($reconId)) {
            throw new Exception("Cannot determine if user is assigned recon order.  Bad order id: '{$reconId}'.");
        }

        $sql = "
            SELECT
                recon_ID_int
            FROM recon_reconciliationorder_tbl
            JOIN reconusr_reconuser_tbl ON
                reconusr_Login_char = recon_AssignedTo_char
            WHERE
                reconusr_ID_int = :userId AND
                recon_ID_int = :reconId";

        $reconId = $this->getAdapter()->fetchOne(
            $sql,
            array(
                ':userId'  => $userId,
                ':reconId' => $reconId
            )
        );

        if (is_numeric($reconId)) {
            return true;
        }

        return false;
    }


    /**
     * Get Next Unassigned Order ID
     *
     * Centralized method for determining what the next order in the Recon Queue
     * is.  This method is company aware and will only pull orders associated
     * with the current user's company.  "Company Zero" users will pull from the
     * Evaluation Solutions queue.
     *
     * @subpackage Multi-Company
     * @return int|null
     */
    public function getNextUnassignedOrderId($status = 'Loaded')
    {
        $companyInfo = Default_Model_Company::getCurrentUserCompany();

        $vendor = $companyInfo['abbreviation'];

        // Company Zero should pull ES orders
        if ($companyInfo['id'] == 0) {
            $vendor = 'ES';
        }

        $whereAssignedTo = " AND recon_ReconciledBy_char IS NULL AND recon_AssignedTo_char IS NULL";
        if ($status == 'Pending Peer Review') {
        	$whereAssignedTo = " AND recon_ReconciledBy_char IS NOT NULL AND recon_PeerReviewAssignedTo_char IS NULL";
        }

        // This Job Title should not be able to load SPO Orders
        $jobTitle = Zend_Auth::getInstance()->getIdentity()->reconusr_JobTitle_char;
        $whereSPO = "";
        if ($jobTitle===self::JOBTITLE_SPO) {
        	$whereSPO = " AND (LOANOFFICER_ORG_NAME NOT LIKE '%SPO%' AND CUSTOM5 NOT LIKE '%SPO%')";
        }

        $sql = "
            SELECT recon_ID_int
            FROM recon_reconciliationorder_tbl
            JOIN reconvalarc_valuationarchive_tbl ON
                reconvalarc_recon_ID_int = recon_ID_int
            JOIN xmldb_fnc.PUSHORDER_ORDER_tbl ON PUSHORDER_ORDER_ord_ID_int = recon_ord_ID_int
            WHERE
                recon_Status_char = :status
                AND reconvalarc_DestVendor_char = :vendor
                {$whereAssignedTo}
                {$whereSPO}
            ORDER BY
            	IF(LOANOFFICER_ORG_NAME  LIKE '%SPO%' OR CUSTOM5  LIKE '%SPO%',0,1),
                recon_Priority_enum ASC,
                recon_Loaded_datetime
            LIMIT 1";
        //Zend_Registry::get('logsql')->info(__METHOD__ . "::{$status}/{$vendor}\n" . $sql);

        return $this->getAdapter()->fetchOne(
        	$sql, 
        	array(
        		':status' 	=> $status,
        		':vendor'	=> $vendor
        	)
        );
    }



    /**
     * Archive RMV Submission
     *
     * This method is used to take a snapshot of the RMV data at the time of
     * submission.  This allows us to reconcile disputes later on.
     *
     * @param int  $reconId
     * @param bool $isFncOrder
     */
    public function archiveRmvSubmit($reconId)
    {
		$isFncOrder = $this->isFncOrder($reconId);

        $rmvData = $this->getUnsubmittedOrders($reconId, $isFncOrder, true);
        $userId  = Zend_Auth::getInstance()->getIdentity()->reconusr_ID_int;

        if (!is_array($rmvData) || (is_array($rmvData) && count($rmvData) === 0)) {
            throw new Exception("Unable to archive RMV data.  No information found for recon ID: {$reconId}.");
        }

		if(!$userId) {
			throw new Exception("Unable to archive RMV data. No User ID.");
		}

        $archiveData = array();

        // Convert raw RMV data result to columns in rmvarc_rmvsubmissionarchive_tbl
        foreach($rmvData as $key => $value) {
            $archiveData["rmvarc_" . $key] = $this->getAdapter()->quote($value);
        }

		// Get info that we store in the archive table
		$sql = "SHOW COLUMNS FROM rmvarc_rmvsubmissionarchive_tbl";
		$desttblinfo = $this->getAdapter()->fetchAll($sql);
		foreach ($desttblinfo as $row) {
			$dest_col[$row['Field']] = $row;
		}

		$sql = "
INSERT INTO rmvarc_rmvsubmissionarchive_tbl
SET
 ";

        // Add data values
        $archiveColumns = array();  // Array of columns to add to insert query
        $skippedColumns = array();  // Array of columns that don't exist in archive table

        // Add user id
        $archiveColumns[] = $this->getAdapter()->quoteInto("rmvarc_reconusr_ID_int = ? ", $userId);

        foreach($rmvData[0] as $key => $value) {
			// Check if we store in archive table ... if not skip
			if (array_key_exists("rmvarc_" . $key, $dest_col)) {
				if ($value) {
					$archiveColumns[] = $this->getAdapter()->quoteInto("rmvarc_" . $key . " = ? ", $value);
				}
			}
            // Keep track of columns we can't find in archive table
            else {
                $skippedColumns[$key] = $value;
            }
        }
        $sql .= implode(",\n ", $archiveColumns);


        // Handle skipped columns so we are aware of lost data
        if (count($skippedColumns) > 0) {

            $cols = "";
            foreach ($skippedColumns as $column => $value) {
                $cols .= "\n" . $column . " => '" . $value . "'";
            }

            $message  = "The following columns were not mapped from reconcil.usp_GetNextRMVResult to reconcil.rmvarc_rmvsubmissionarchive_tbl.  ";
            $message .= "Please ensure that changes to reconcil.usp_GetNextRMVResult are always mirrored in reconcil.rmvarc_rmvsubmissionarchive_tbl.";
            $message .= "\n\nRecon ID: {$reconId}\nUser ID: {$userId}\n\n---\n";
            $message .= $cols;

            @mail(
                (APPLICATION_ENV == 'production') ? 'esit@evalonline.net' : 'dsipe@evalonline.net',
                'Trouble Archiving RMV Submit',
                $message,
                'From: "RMV Archiver" <noreply@evalonline.net>'
            );
        }


        // Save data.  If exception thrown, re-throw with actual query ran.
        try {
            $this->getAdapter()->query($sql);
        }
        catch (Exception $e){
            throw new Exception($e->getMessage() . "\n\nQuery:\n" . $sql);
        }
    }

    public function isFncOrder($reconId)
    {
        $sql = "
            SELECT COUNT(*)
            FROM reconcil.recon_reconciliationorder_tbl
            WHERE
                recon_ID_int = ?
                AND IFNULL(recon_FNC_Folder_Num_varchar,'') <> ''";

        $count = $this->getAdapter()->fetchOne($sql, $reconId);

        if ($count) {
            return true;
        }

        return false;
    }


    public function getAppraisalPortUserIdByFolderNumber($folderNumber)
    {
        $sql = "
            SELECT
                UID
            FROM xmldb_fnc.PUSHORDER_ORDER_tbl
            WHERE
                FOLDER_NUMBER = ?";

        return $this->getAdapter()->fetchOne($sql, $folderNumber);
    }

    public function isAffectedOilZip($zip)
    {
    	$sql = "SELECT count(*) FROM evsmysql.addrzipoil_zipcodesaffectedbyoilspill_tbl WHERE addrzipoil_Zip_int = ?";
    	$count = $this->getAdapter()->fetchOne($sql, $zip);
    	return ($count) ? true : false;
    }
}

<?php
/**
 * Recon Controller
 *
 * Key actions:
 *  * savermvAction() - Saves RMV Form data
 */
class ReconController extends Zend_Controller_Action
{
	public function init()
	{
		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();
		$this->view->extjsUrl = $this->getInvokeArg('bootstrap')->getOption('extjsurl');
	}

	public function preDispatch()
	{
		if (!Zend_Auth::getInstance()->hasIdentity()) {
			$this->_redirect('auth');
		}

		if (true!==Eval_Vip::isValid()) {
			$this->_redirect('auth');
		}
	}
	
	public function checkuserquotaAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();
		
		$response = array(
			'success' => true, 
			'quotaExceeded' => true, 
			'message' => 'You have reached the daily peer review quota, contact your manager to unassign your outstanding peer reviews.'
		);
		
		$username = Zend_Auth::getInstance()->getIdentity()->reconusr_Login_char;
		
		$model = new Default_Model_ReconUserTotal();
		$hasExceeded = $model->getUserExceeded($username);
		if ($hasExceeded === false) {
			$response['quotaExceeded'] = false;
			$response['message'] = null;
		}
		
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		$this->getResponse()->setBody(Zend_Json::encode($response));
	}

	public function savereviewAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();

		$username = Zend_Auth::getInstance()->getIdentity()->reconusr_Name_char;
		$datetime = date("m/d/Y g:i a");
		$now = new Zend_Db_Expr('NOW()');

		$reconid = $this->getRequest()->getParam('reconid');
		$status = $this->getRequest()->getParam('status');
		$reason = $this->getRequest()->getParam('reason');
		$usercomment = $this->getRequest()->getParam('review');

		$dataRecon = array(
			'recon_Status_char' 					=> $status,
			'recon_ReviewComment_text' 				=> $usercomment,
			'recon_ReviewUser_char' 				=> $username,
			'recon_ReviewDate_datetime' 			=> $now,
			'recon_reconfreas_FailedReason_char' 	=> $reason
		);

		//Zend_Registry::get('logdebug')->info('reconID: ' . $reconid);
		//Zend_Registry::get('logdebug')->info('dataRecon: ' . print_r($dataRecon,true));

		$model = new Default_Model_Order;
		$where = $model->getAdapter()->quoteInto('recon_ID_int = ?', $reconid);
		$model->update($dataRecon, $where);


		$response = array('success' => true, 'message' => 'Status updated: ' + $status);
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		$this->getResponse()->setBody(Zend_Json::encode($response));
	}

	public function savepivotdataAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();

		//Zend_Registry::get('logsql')->info('RAW POST: ' . print_r($_POST,true));

		$modelRecon = new Default_Model_ReconData;

		$reconids = $this->_request->getParam('reconids');
		$ids = array();
		if (is_array($reconids) AND count($reconids) > 0) {
			foreach ($reconids as $id) {
				$data = array();
				if (is_numeric($id) AND ($id > 0)) {
					$ids[] = $id;

					//$data['recondata_PriorDate_char'] = date("Y-m-d", strtotime($_POST['effective_rpt_date'][$id]));
					$data['recondata_Vendor_char'] = $_POST['apprvndr_name'][$id];
					$data['recondata_Inspection_enum'] = $_POST['insp_type'][$id];
					$data['recondata_EffectiveReportDate_date'] = date("Y-m-d", strtotime($_POST['effective_rpt_date'][$id]));
					$data['recondata_ReportedValue_char'] = $this->stripCurrency($_POST['value'][$id]);
					$data['recondata_CompSaleLow_char'] = $this->stripCurrency($_POST['sales_range_low'][$id]);
					$data['recondata_CompSaleHigh_char'] = $this->stripCurrency($_POST['sales_range_high'][$id]);
					$data['recondata_CompListLow_char'] = $this->stripCurrency($_POST['current_low'][$id]);
					$data['recondata_CompListHigh_char'] = $this->stripCurrency($_POST['current_high'][$id]);
					$data['recondata_MarketTrend_char'] = $_POST['mktrend'][$id];
					$data['recondata_MarketComments_char'] = $_POST['mktrend_comments'][$id];

					$data['recondata_Subj_Age_int'] = $_POST['sjbage'][$id];
					$data['recondata_Subj_Style_char'] = $_POST['sbjsty'][$id];
					$data['recondata_Subj_Type_char'] = $_POST['sbjtyp'][$id];
					$data['recondata_Subj_Construction_char'] = $_POST['sbjcnstr'][$id];
					$data['recondata_Subj_LegalUse_char'] = $_POST['sbjlgluse'][$id];
					$data['recondata_Subj_LotSize_char'] = $this->stripCurrency($_POST['sitesize'][$id]);
					$data['recondata_Subj_Condition_char'] = $_POST['sbjcnd'][$id];
					$data['recondata_Subj_RepairCost_char'] = $this->stripCurrency($_POST['cost_to_cure'][$id]);
					$data['recondata_Subj_RepairDescription_char'] = $_POST['mjrprs_needed'][$id];
					$data['recondata_Subj_GLA_int'] = $_POST['sbjgla'][$id];
					$data['recondata_Subj_TotalRooms_char'] = $_POST['totalrooms'][$id];
					$data['recondata_Subj_Beds_char'] = $_POST['totalbr'][$id];
					$data['recondata_Subj_Baths_char'] = $_POST['totalbathfull'][$id];
					$data['recondata_Subj_HalfBath_char'] = $_POST['totalbathhalf'][$id];
					$data['recondata_Subj_Foundation_char'] = $_POST['foundation'][$id];
					$data['recondata_Subj_Basement_char'] = $_POST['bsmtfinished'][$id];

					$data['recondata_SubjListed_enum'] = $_POST['sbjlisted'][$id];
					$data['recondata_SubjListed_StartPrice_char'] = $this->stripCurrency($_POST['lststaskprice'][$id]);
					$data['recondata_SubjListed_EndPrice_char'] = $this->stripCurrency($_POST['lstcrntaskprice'][$id]);
					$data['recondata_SubjListed_DOM_int'] = $_POST['lstdaysmkt'][$id];
					$data['recondata_SubjListed_Agent_char'] = $_POST['lstofcnm'][$id];

					$this->filterPivotData($data);
					Zend_Registry::get('logsql')->info("RECON ID[{$id}]: " . print_r($data,true));

					$modelRecon->updatePivotData($data, $id);

				}
			}
		}

		$response = array('success' => true, 'message' => 'Your data has been saved.');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		$this->getResponse()->setBody(Zend_Json::encode($response));
	}

	private function stripCurrency($str)
	{
		return preg_replace('/[^0-9]/', '', $str);
	}

	private function filterPivotData(&$data)
	{
		$filter = new Zend_Filter_StripTags();
		$null = new Zend_Db_Expr('NULL');
		foreach ($data as $key => $value) {
			$data[$key] = $filter->filter($value);
			// convert blank values to DB NULLS
			if (strlen($value)<1) {
				$data[$key] = $null;
			}
		}
	}

	public function pivotdataAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();

		$id = $this->getRequest()->getParam('id');

		$modelFiles = new Default_Model_UploadFile();
		$files = $modelFiles->getReconDataThumbPhotos($id);
		//Zend_Registry::get('logdebug')->info('Thumbs: '.print_r($files,true));
		$thumbs = array();
		foreach($files as $row) {
			$thumbs[$row['upldfl_ID_int']] = $row;
		}

		$modelRecon = new Default_Model_ReconData;
		$data = $modelRecon->getDataPivot($id);

		$response = array();
		$response["count"] = count($data);
		$response['thumbs'] = $thumbs;
		$response["data"] = $data;
		//$response['thumbs'] = $files;

		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		//$this->getResponse()->setBody(print_r($data,true));
		$this->getResponse()->setBody(Zend_Json::encode($response));
	}

	public function ancillaryAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();

		$id = $this->getRequest()->getParam('id');

		$table = new Default_Model_AncData();
		$table->generateFormFields($id);
		$select = $table->select();
		$select->where('reconancil_recon_ID_int = ?',$id);
		$data = $table->fetchAll($select);

		// Generate field if they're empty
		/*if (count($data) === 0) {
		    $table->generateFormFields($id);
		    $select = $table->select();
    		$select->where('reconancil_recon_ID_int = ?',$id);
    		$data = $table->fetchAll($select);
		}*/

		$results = array();
		foreach ($data as $row) {
			$results[] = $row->toArray();
		}



		//$writer = new Zend_Log_Writer_Stream(dirname(__FILE__).'/../../logs/debug.log');
		//$logger = new Zend_Log($writer);
		//$logger->info('ID: ' . print_r($results,true));

		$response = array();
		$response["count"] = count($data);
		$response["data"] = $results;
		$response['id'] = $id;

		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		$this->getResponse()->setBody(Zend_Json::encode($response));
	}

	public function saveancdataAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();

		$fields = $_POST['field'];
		Zend_Registry::get('logdebug')->info('RAW POST: ' . print_r($fields,true));

		$table = new Default_Model_AncData();
		if (is_array($fields) && count($fields) > 0) {
			foreach ($fields as $id => $value) {
				Zend_Registry::get('logdebug')->info("{$id} = {$value}");
				$data = array();
				$data['reconancil_Value_char'] = $value;

				$where = $table->getAdapter()->quoteInto('reconancil_ID_int = ?', $id);
				$table->update($data, $where);
			}
		}

		$response = array('success' => true, 'message' => 'Your data has been saved.');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		$this->getResponse()->setBody(Zend_Json::encode($response));
	}



	/**
	 * Get Next Order
	 *
	 */
	public function getnextorderAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();
		
		$isPeerReview = ($this->getRequest()->getParam('isPeerReview')=='1') ? true : false;
		
		if ($isPeerReview === false) {
			$tblSetting = new Default_Model_Setting();
			if ($tblSetting->getSettingByName('QUEUES_DISABLE_GETORDER')===1) {
				//Zend_Registry::get('logdebug')->info('Queues Disabled');
				$response = array('success' => true, 'message' => 'This feature is currently disabled. Please check back later.');
				$this->getResponse()->setHeader('Content-Type', 'text/javascript');
				$this->getResponse()->setBody(Zend_Json::encode($response));
				return;
			}
		}

		$tblOrder = new Default_Model_Order();

		$orderStatus = ($isPeerReview) ? 'Pending Peer Review' : 'Loaded';
		$nextreconid = $tblOrder->getNextUnassignedOrderId($orderStatus);

		//$writer = new Zend_Log_Writer_Stream(dirname(__FILE__).'/../../logs/debug.log');
		//$logger = new Zend_Log($writer);
		//$logger->info('NEXT ID: ' . $nextreconid);
		//$logger->info('PEER REVIEW: [' .  $this->getRequest()->getParam('isPeerReview') . ']');

		$username = Zend_Auth::getInstance()->getIdentity()->reconusr_Login_char;

		if ($isPeerReview) {
			$dataAssign = array(
				'recon_Status_char' 					=> 'Peer Review In Progress',
				'recon_PeerReviewAssignedTo_char' 		=> $username,
				'recon_PeerReviewAssignedTo_datetime' 	=> date('Y-m-d H:i:s')
			);
		} else {
			$dataAssign = array(
				'recon_AssignedTo_char' 	=> $username,
				'recon_Assigned_datetime' 	=> date('Y-m-d H:i:s')
			);
		}
		$where = $tblOrder->getAdapter()->quoteInto('recon_ID_int = ?', $nextreconid);
		$tblOrder->update($dataAssign, $where);

		$response = array('success' => true, 'message' => $message);

		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		$this->getResponse()->setBody(Zend_Json::encode($response));
	}

	public function processreconeditAction()
	{
	    $this->_helper->viewRenderer->setNoRender();
	    $this->_helper->layout->disableLayout();

		$filter = new Zend_Filter_StripTags();
        $jsondata = $filter->filter($this->_request->getPost("data"));
        $data = Zend_Json::decode($jsondata);

        //$dataid, $id, $label, $value, $column

        foreach($data as $id => $row) {
    		$label = $data[$id]['Label_char'];
    		$value1 = $data[$id]['ValueOne_char'];
    		$value2 = $data[$id]['ValueTwo_char'];
    		$value3 = $data[$id]['ValueThree_char'];
    		$value4 = $data[$id]['ValueFour_char'];

		    $tbl = new Default_Model_ReconData();
		    //$tbl->saveReconData($dataid, $id, $label, $value1, 1);
		    //$tbl->saveReconData($dataid, $id, $label, $value2, 2);
		    //$tbl->saveReconData($dataid, $id, $label, $value3, 3);
		    //$tbl->saveReconData($dataid, $id, $label, $value4, 4);

    		//$writer = new Zend_Log_Writer_Stream(dirname(__FILE__).'/../../logs/debug.log');
    		//$logger = new Zend_Log($writer);
    		//$logger->info('Mode: ' . $savemode);
	    }

		$response = array('success' => true, 'message' => $label);

		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		$this->getResponse()->setBody(Zend_Json::encode($response));
	}

	/**
	 * Generate Reconcil PDF
	 *
	 * @todo Update bootstrap to autoload PDFs
	 */
	public function pdfAction()
	{
	    $this->_helper->viewRenderer->setNoRender();
	    $this->_helper->layout->disableLayout();

	    require_once dirname(__FILE__) .'/../pdfs/Rmv.php';

        $orderId = $this->_request->getParam('order');

	    if ($this->_request->getParam('name')) {
	        $filename = $this->_request->getParam('name');
	    }
	    else {
	        $filename = "RMV_{$orderId}.pdf";
	    }




	    $PDF = new Default_Pdf_Rmv($orderId);
        $PDF->Output($filename, "D");
	}

	/**
	 * Generate Reconcil PDF
	 *
	 * @todo Update bootstrap to autoload PDFs
	 */
	public function testpdfAction()
	{
	    $this->_helper->viewRenderer->setNoRender();
	    $this->_helper->layout->disableLayout();

	    require_once dirname(__FILE__) .'/../pdfs/TestRmv.php';

        $orderId = $this->_request->getParam('order');

	    if ($this->_request->getParam('name')) {
	        $filename = $this->_request->getParam('name');
	    }
	    else {
	        $filename = "RMV_{$orderId}.pdf";
	    }

	   $PDF = new Default_Pdf_TestRmv($orderId);
       $PDF->Output($filename, "D");
	}


	public function historyproAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();

        $esOrderId = $this->_getParam('esorderid');

        // if alraedy uploaded do not allow
        $dbFiles  = new Default_Model_UploadFile;
        $rmvfiles = $dbFiles->getRmvResultFiles($esOrderId);
        $hpro = false;
        foreach ($rmvfiles as $row) {
        	if (eregi('history',$row['upldfl_filetype_char'])) {
        		$hpro = true;
        	}
        }
        //var_dump($hpro);
        //echo "<hr/>";
		//print_r($rmvfiles);
		if (false===$hpro) {
	        if (!is_numeric($esOrderId)) {
	            $this->_redirect($this->view->baseUrl);
	            return;
	        }

	        $CorelogicModel = new Default_Model_Corelogic();
	        $reportData = $CorelogicModel->getHistoryProReport($esOrderId, 1234);
			echo $reportData;
		} else {
			echo "<h3>History Pro file has already been uploaded. To view the existing History Pro file, click on the History Pro file link under the \"RMV Result Files\" title in the Related Files section.</h3>
			<hr/><input type=\"button\" value=\"Close Window and Return to Previous Page\" onClick=\"window.close();\" />";
		}
	}

	public function lastcommentAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();

		$id = $this->_request->getParam('id');

		$model = new Default_Model_ReconData;
		$comment = $model->getLastComment($id);

		$rs = array('success' => true, 'comment' => $comment);

		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		$this->getResponse()->setBody(Zend_Json::encode($rs));

	}

	public function combofailedreasonsAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();

		$modelRecon = new Default_Model_ReconData;
		$reasons = $modelRecon->getFailedReasons();

		$response = array();
		$response['totalItems'] = count($reasons);
		$response['items'] = $reasons;

		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		$this->getResponse()->setBody(Zend_Json::encode($response));
	}

	public function combofmvdaystosellAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();

		$modelRecon = new Default_Model_ReconData;
		$data = $modelRecon->getFMVDaysToSellOpts();

		$response = array();
		$response['totalItems'] = count($data);
		$response['items'] = $data;

		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		$this->getResponse()->setBody(Zend_Json::encode($response));
	}

	/**
	 * Save comments without updating status
	 */
	public function savecommentsAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();

		//Zend_Registry::get('logdebug')->info('savecommentsAction post: ' . print_r($_POST,true));

		// SAVE RMV DATA
		$rmvid = $this->_request->getParam('comments_rmv_ID_int');
		$data = array();
		$data['rmv_concl_as_is_int'] = $this->_request->getParam('comments_rmv_concl_as_is_int');
		$data['rmv_concl_as_is_int'] = ($data['rmv_concl_as_is_int'] == '') ? NULL : $data['rmv_concl_as_is_int'];
		$data['rmv_concl_as_repaired_int'] = $this->_request->getParam('comments_rmv_concl_as_repaired_int');
		$data['rmv_concl_as_repaired_int'] = ($data['rmv_concl_as_repaired_int'] == '') ? NULL : $data['rmv_concl_as_repaired_int'];
		$data['rmv_concl_repair_cost_int'] = $this->_request->getParam('comments_rmv_concl_repair_cost_int');
		$data['rmv_concl_repair_cost_int'] = ($data['rmv_concl_repair_cost_int'] == '') ? NULL : $data['rmv_concl_repair_cost_int'];

		// Fair Market Value
		$data['rmv_concl_fmv_as_is_int'] = $this->_request->getParam('comments_rmv_concl_fmv_as_is_int');
		$data['rmv_concl_fmv_as_is_int'] = ($data['rmv_concl_fmv_as_is_int'] == '') ? NULL : $data['rmv_concl_fmv_as_is_int'];
		$data['rmv_concl_fmv_as_repaired_int'] = $this->_request->getParam('comments_rmv_concl_fmv_as_repaired_int');
		$data['rmv_concl_fmv_as_repaired_int'] = ($data['rmv_concl_fmv_as_repaired_int'] == '') ? NULL : $data['rmv_concl_fmv_as_repaired_int'];
		$data['rmv_concl_fmv_repair_cost_int'] = $this->_request->getParam('comments_rmv_concl_fmv_repair_cost_int');
		$data['rmv_concl_fmv_repair_cost_int'] = ($data['rmv_concl_fmv_repair_cost_int'] == '') ? NULL : $data['rmv_concl_fmv_repair_cost_int'];
		$data['rmv_concl_fmv_estimateddaystosell_char'] = $this->_request->getParam('comments_rmv_concl_fmv_estimateddaystosell_char');
		$data['rmv_concl_fmv_estimateddaystosell_char'] = ($data['rmv_concl_fmv_estimateddaystosell_char'] == '') ? NULL : $data['rmv_concl_fmv_estimateddaystosell_char'];

		$data['rmv_concl_fmv_notes_text'] = $this->_request->getParam('rmv_concl_fmv_notes_text');

		//Zend_Registry::get('logdebug')->info('Comments Form: RMV Data: ' . print_r($data,true));
		$modelQA = new Default_Model_QAData;
		$modelQA->updateRMVData($data, $rmvid);

		$comments = $this->_request->getParam('recon_comments_text');
		$reconid = $this->_request->getParam('recon_comments_reconid');

		$tblTxt = new Default_Model_ReconText();
		$data = array(
			'recontxt_recon_ID_int' 	   => trim($reconid),
			'recontxt_Reconciliation_text' => trim($comments)
		);
		$txtid = $tblTxt->insert($data);

		$dataOrder = array(
			'recon_recontxt_ID_int' => $txtid
		);

		$tblOrder = new Default_Model_Order();
		$where = $tblOrder->getAdapter()->quoteInto('recon_ID_int = ?', $reconid);
		$tblOrder->update($dataOrder, $where);

		$response = array('success' => true, 'message' => 'Your data has been saved.');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		$this->getResponse()->setBody(Zend_Json::encode($response));
	}

	public function loadedordersAction()
	{
		$this->view->title = "My Valuation Archive Loaded Orders";
		$this->view->headScript()->appendFile(
		    $this->getFrontController()->getBaseUrl() . '/extjsmanager/loadloadedorders');
		$this->view->headScript()->appendFile(
		    $this->getFrontController()->getBaseUrl() . '/visifire_v1.5.8/Visifire.js');

	}

	public function gridloadedordersAction()
	{
		$this->_helper->layout->disableLayout();
		$this->_helper->viewRenderer->setNoRender();

		$modelOrder = new Default_Model_Order();
		$limitParams = array(
            'sort' => $this->_request->getParam('sort'),
            'dir' => $this->_request->getParam('dir'),
            'limit' => $this->_request->getParam('limit'),
			'start' => $this->_request->getParam('start')
        );
		$reconUser = Zend_Auth::getInstance()->getIdentity()->reconusr_Login_char;
		$orders = $modelOrder->getLoadedOrders($reconUser, $limitParams);

		$response = array();
		$response["count"] = $modelOrder->getLoadedOrdersCount($reconUser);
		$response["orders"] = $orders;

		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		$this->getResponse()->setBody(Zend_Json::encode($response));
	}

	public function reconciledordersAction()
	{
		$this->view->title = "My Reconciled Orders";
		$this->view->headScript()->appendFile(
		$this->getFrontController()->getBaseUrl() . '/extjsmanager/loadreconciledorders');
		$this->view->headScript()->appendFile(
		$this->getFrontController()->getBaseUrl() . '/visifire_v1.5.8/Visifire.js');

	}

	public function gridreconciledordersAction()
	{
		$this->_helper->layout->disableLayout();
		$this->_helper->viewRenderer->setNoRender();

		$modelOrder = new Default_Model_Order();
		$limitParams = array(
			'sort' => $this->_request->getParam('sort'),
			'dir' => $this->_request->getParam('dir'),
			'limit' => $this->_request->getParam('limit'),
			'start' => $this->_request->getParam('start'),
			'filters' => (($this->_request->getParam('filter')) ? $this->_request->getParam('filter') : NULL)
        );
		$reconUser = Zend_Auth::getInstance()->getIdentity()->reconusr_Login_char;
		$orders = $modelOrder->getReconciledOrders($reconUser, $limitParams);

		$response = array();
		$response["count"] = $modelOrder->getReconciledOrdersCount($reconUser, $limitParams);
		$response["orders"] = $orders;

		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		$this->getResponse()->setBody(Zend_Json::encode($response));
	}

	public function lastnoteAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();

		$id = $this->_request->getParam('id');

		$model = new Default_Model_ReconData;
		$note = $model->getLastNote($id);

		$y2k = mktime(0,0,0,1,2,2000);
		$inserted = strtotime($note['reconnt_inserted_datetime']);
		if ($inserted >= mktime(0,0,0,1,2,2000)) {
			$note['reconnt_inserted_datetime'] = date(('m/d/Y g:i a'), $inserted);
		}

		$rs = array('success' => true, 'note' => $note);

		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		$this->getResponse()->setBody(Zend_Json::encode($rs));
	}

	public function affirmrmvdataAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();

		$reconid = $this->getRequest()->getParam('reconid');

		$tbl = new Default_Model_ReconData();
		$data = $tbl->getAffirmFieldData($reconid);

		$response = array('success' => true, 'data' => $data);

		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
        $this->getResponse()->setBody(Zend_Json::encode($response));
        //$this->getResponse()->setBody(print_r($data,true));
	}

	public function affirmrmvfieldAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();

		//Zend_Registry::get('logdebug')->info('affirmrmvAction: POST ' . print_r($_POST,true));
		$on = $this->getRequest()->getParam('on');
		$affirm = ($on=='true') ? true : false;
		$data = array(
			'reconid' 	=> $this->getRequest()->getParam('reconid'),
			'userid' 	=> Zend_Auth::getInstance()->getIdentity()->reconusr_ID_int,
			'fieldid'	=> $this->getRequest()->getParam('fieldid'),
			'label'		=> $this->getRequest()->getParam('label')
		);

		//Zend_Registry::get('logdebug')->info('affirmrmvAction: ' . print_r($data,true));
		//Zend_Registry::get('logdebug')->info('$affirm: ' . $affirm);

		$tbl = new Default_Model_ReconData();
		$tbl->saveAffirmRMVFields($data, $affirm);

		$success = true;
		$message = "success";
		$response = array('success' => true, 'message' => $message);

		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		$this->getResponse()->setBody(Zend_Json::encode($response));
	}

	/**
     * Save RMV Form Data
     *
     * This action is called when the user attempts to submit an
     * RMV or saves and RMV draft.
     */
	public function savermvAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();

		//Zend_Registry::get('logrmv')->info('savermvAction: ' . print_r($_POST,true));

		$savemode = $_POST['recon_comments_save_mode'];

		$message = '';

		$this->saveAncData($_POST['field']);

        // Save data from the RMV form
		$this->saveRMVData($_POST);


		if ($savemode==='draft') {
			$this->saveCommentsData($_POST);
		} elseif ($savemode==='submit') {
			$message = $this->submitCommentsData($_POST);
		} elseif ($savemode==='review') {
			$this->submitReviewData($_POST);
		} elseif ($savemode==='peerreview-submit') {
			$this->submitPeerReviewData($_POST, $savemode);
		} elseif ($savemode==='peerreview-fail') {
			$this->submitPeerReviewData($_POST, $savemode);
		}

		$response = array('success' => true, 'message' => $message);

		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		$this->getResponse()->setBody(Zend_Json::encode($response));
	}

	private function saveAncData($fields)
	{
		$table = new Default_Model_AncData();
		if (is_array($fields) && count($fields) > 0) {
			foreach ($fields as $id => $value) {
				$data = array();
				$data['reconancil_Value_char'] = $value;

				$where = $table->getAdapter()->quoteInto('reconancil_ID_int = ?', $id);
				$table->update($data, $where);
			}
		}
	}

    /**
     * Save RMV Form data
     * @param array $post  Post data from the RMV form
     * @return void
     */
	private function saveRMVData($post)
	{

		$rmvIgnore = array(
			'comments_rmv_concl_as_is_int',
			'rmv_ID_int',
			'comments_rmv_ID_int',
			'comments_rmv_concl_as_repaired_int',
			'comments_rmv_concl_repair_cost_int',
			'recon_rmv_review_failedreason',
			'recon_rmv_review_comments',
			'rmv_recon_ID_int',
			'recon_rmv_review_status',
			'comments_rmv_concl_fmv_as_is_int',
			'comments_rmv_concl_fmv_as_repaired_int',
			'comments_rmv_concl_fmv_repair_cost_int',
			'comments_rmv_concl_fmv_estimateddaystosell_char'
		);

		$post['rmv_concl_as_is_int']           = $post['comments_rmv_concl_as_is_int'];
		$post['rmv_concl_as_repaired_int']     = $post['comments_rmv_concl_as_repaired_int'];
		$post['rmv_concl_repair_cost_int']     = $post['comments_rmv_concl_repair_cost_int'];

		// Fair Market Value
		$post['rmv_concl_fmv_as_is_int']       = $post['comments_rmv_concl_fmv_as_is_int'];
		$post['rmv_concl_fmv_as_repaired_int'] = $post['comments_rmv_concl_fmv_as_repaired_int'];
		$post['rmv_concl_fmv_repair_cost_int'] = $post['comments_rmv_concl_fmv_repair_cost_int'];
		$post['rmv_concl_fmv_estimateddaystosell_char'] = $post['comments_rmv_concl_fmv_estimateddaystosell_char'];

		$data = array();
		$data['rmv_prepared_by_char'] = Zend_Auth::getInstance()->getIdentity()->reconusr_Name_char;
		$data['rmv_prepared_date'] = date('Y-m-d H:i:s');

  		$dataViolations = array();
        $dataAssessments = array();
        $dataRepairs = array();
        $dataPriorBPO2 = array();
        $dataPriorBPO3 = array();
        $dataPriorBPO4 = array();

        $rmvid = $post['rmv_ID_int'];
        $reconid = $post['rmv_recon_ID_int'];

        foreach ($post as $col => $value) {

            // If a POST variable begins with "rmv_" add to $data array for later insertion into
            //   rmv_reconciledmarketvalue_tbl
            if (stristr($col, 'rmv_')!==false AND !in_array($col, $rmvIgnore)) {
                if ( (strlen($value) > 0) AND (stristr($col, '_date')!==false)) {
                    $data[$col] = date('Y-m-d', strtotime($value));
                }
                // If the value being saved is the string "null" convert that into a true NULL value
                else if ($value == 'null') {
                    $data[$col] = NULL;
                }
                else {
                    $data[$col] = (strlen($value) > 0) ? $value : NULL;
                }
            }

            if (stristr($col, 'reconrmvvio_')!==false AND $post['rmv_misrep_violations_enum']=='Yes') {
                $dataViolations[] = $col;
            }

            //if (stristr($col, 'reconrmvassmt_')!==false AND $post['rmv_bpo_review_assessment_enum']=='Unreliable') {
            if (stristr($col, 'reconrmvassmt_')!==false) {
                $dataAssessments[] = $col;
            }

            if (stristr($col, 'reconrpradd_')!==false) {
                $dataRepairs[$col] =  $value;
            }

            if (stristr($col, 'reconpriorbpo2_')!==false AND $_POST['reconpriorbpo2_flag']=='1') {
                $dataPriorBPO2[$col] = (strlen($value) > 0) ? $value : NULL;
            }

            if (stristr($col, 'reconpriorbpo3_')!==false AND $_POST['reconpriorbpo3_flag']=='1') {
                $dataPriorBPO3[$col] = (strlen($value) > 0) ? $value : NULL;
            }

            if (stristr($col, 'reconpriorbpo4_')!==false AND $_POST['reconpriorbpo4_flag']=='1') {
                $dataPriorBPO4[$col] = (strlen($value) > 0) ? $value : NULL;
            }
        }

		$dbPriorBPO = new Default_Model_ReconPriorBPO();

        $modelQA = new Default_Model_QAData;
        $modelQA->updateRMVData($data, $rmvid);

        if (count($dataPriorBPO2) > 0) {
        	$dbPriorBPO->save($reconid, $dataPriorBPO2, 2);
        }
        if (count($dataPriorBPO3) > 0) {
        	$dbPriorBPO->save($reconid, $dataPriorBPO3, 3);
        }
        if (count($dataPriorBPO4) > 0) {
        	$dbPriorBPO->save($reconid, $dataPriorBPO4, 4);
        }

        if (count($dataViolations) > 0) {
            $modelQA->updateRMVViolations($dataViolations, $reconid);
        }

        // clear assessments
        //$modelQA->clearRMVAssessments($reconid);
        //if (count($dataAssessments) > 0) {
            $modelQA->updateRMVAssessments($dataAssessments, $reconid);
        //}

        if (count($dataRepairs) > 0) {
            $modelQA->updateRMVRepairs($dataRepairs, $reconid);
        }

        // save influential data
        $tblObsInfl = new Default_Model_ReconObservedInfluences();
        $tblObsInfl->clearData($reconid);
        //if (!array_key_exists('opt-gmap-noexinfluences', $post)) {
        	 $tblObsInfl->saveData($reconid, $post);
        //}

        // update address
        if (isset($post['rmv_cust_addr_st_char'])) {
        	$addrdata = array(
				'address'	=> $post['rmv_cust_addr_st_char'],
				'city'		=> $post['rmv_cust_addr_city_char'],
				'state'		=> $post['rmv_cust_addr_state_char'],
				'zip'		=> $post['rmv_cust_addr_zip_char'],
				'esid'		=> $post['recon_ord_ID_int']
			);
			//Zend_Registry::get('logdebug')->info('addrdata: ' . print_r($addrdata,true));
			$modelCL = new Default_Model_Corelogic();
			$modelCL->saveAddressData($addrdata);
        }

        // Run RMV Auto QA check
        $modelQA->runAutoQACheck($post['recon_ord_ID_int']);

	}

	public function priorbpodataAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();

		$reconid->getRequest()->getParam('reconid');
		$tblPriorBPO = new Default_Model_ReconPriorBPO();
		$rows = $tblPriorBPO->getRecordsByRecon($reconid);

		$response = array('success' => true, 'rows' => $rows);
        $this->getResponse()->setHeader('Content-Type', 'text/javascript');
        //$this->getResponse()->setBody(print_r($response,true));
        $this->getResponse()->setBody(Zend_Json::encode($response));
	}


    /**
     * Save RMV form comments as a draft
     * @param array $post RMV Form post data
     * @return void
     */
	private function saveCommentsData($post)
	{
		$comments = $post['recon_comments_text'];
		$reconid = $post['recon_comments_reconid'];

		if ($post['affected_by_oil']=='No') {
			$oilqst1 = new Zend_Db_Expr("NULL");
			$oilqst2 = new Zend_Db_Expr("NULL");
		} else {
			$oilqst1  = ('Yes'==$post['combo_oil_question1']) ? 'Yes' : 'No';
			$oilqst2  = ('Yes'==$post['combo_oil_question2']) ? 'Yes' : 'No';
		}

		$tblTxt = new Default_Model_ReconText();
		$data = array(
			'recontxt_recon_ID_int' 	   => trim($reconid),
			'recontxt_Reconciliation_text' => trim($comments)
		);
		$txtid = $tblTxt->insert($data);

		$username = Zend_Auth::getInstance()->getIdentity()->reconusr_Login_char;
		$dataOrder = array(
			'recon_recontxt_ID_int' => $txtid,
			'recon_Status_char' => 'Draft Saved',
			'recon_ReconciledBy_char' => $username,
			'recon_Reconciled_datetime' => date('Y-m-d H:i:s'),
			'recon_OilQuestion1_enum' => $oilqst1,
			'recon_OilQuestion2_enum' => $oilqst2
		);

		$tblOrder = new Default_Model_Order();
		$tblOrder->logStatusChange('Draft Saved', array($reconid));

		$where = $tblOrder->getAdapter()->quoteInto('recon_ID_int = ?', $reconid);
		$tblOrder->update($dataOrder, $where);
	}

	private function submitPeerReviewData($post, $savemode = false)
	{
		$username = Zend_Auth::getInstance()->getIdentity()->reconusr_Name_char;
		$datetime = date("m/d/Y g:i a");
		$now = new Zend_Db_Expr('NOW()');

		if ($post['affected_by_oil']=='No') {
			$oilqst1 = new Zend_Db_Expr("NULL");
			$oilqst2 = new Zend_Db_Expr("NULL");
		} else {
			$oilqst1  = ('Yes'==$post['combo_oil_question1']) ? 'Yes' : 'No';
			$oilqst2  = ('Yes'==$post['combo_oil_question2']) ? 'Yes' : 'No';
		}

		$reconid = trim($post['recon_comments_reconid']);
		$status = trim($post['recon_rmv_review_status']);
		$reason = trim($post['recon_rmv_review_failedreason']);
		$usercomment = trim($post['recon_rmv_review_comments']);
		$reconcomments = trim($post['recon_comments_text']);

		$tblTxt = new Default_Model_ReconText();
		$data = array(
			'recontxt_recon_ID_int' 	   => $reconid,
			'recontxt_Reconciliation_text' => $reconcomments
		);
		$txtid = $tblTxt->insert($data);

		$model = new Default_Model_Order;

		$dataRecon = array(
			'recon_recontxt_ID_int' 				=> $txtid,
			'recon_Status_char' 					=> $status,
			'recon_ReviewComment_text' 				=> $usercomment,
			'recon_OilQuestion1_enum' 				=> $oilqst1,
			'recon_OilQuestion2_enum' 				=> $oilqst2
		);

		if ($savemode==='peerreview-submit') {
			$dataRecon['recon_FinalReconciledBy_varchar'] = $username;
			$dataRecon['recon_FinalReconciledBy_datetime'] = date('Y-m-d H:i:s');
		}

		if ($reason!=='Select a reason for your action...') {
			$dataRecon['recon_reconfreas_FailedReason_char'] = $reason;
		}

		//Zend_Registry::get('logdebug')->info('reconID: ' . $reconid);
		//Zend_Registry::get('logrmv')->info('dataRecon: ' . print_r($dataRecon,true));
		$model->logStatusChange($status, array($reconid));

		$where = $model->getAdapter()->quoteInto('recon_ID_int = ?', $reconid);
		$model->update($dataRecon, $where);

		if ($savemode==='peerreview-submit') {
			$stmt = $model->getAdapter()->prepare("CALL evsmysql.usp_clivndbr_realtimewrapper(?)");
			$stmt->bindValue(1, $post['recon_ord_ID_int']);
			try {
				$stmt->execute();
			} catch (Exception $e) {
				Zend_Registry::get('logsql')->info(print_r($e,true));
			}
		}
	}

	private function submitReviewData($post)
	{
		$username = Zend_Auth::getInstance()->getIdentity()->reconusr_Name_char;
		$datetime = date("m/d/Y g:i a");
		$now = new Zend_Db_Expr('NOW()');

		if ($post['affected_by_oil']=='No') {
			$oilqst1 = new Zend_Db_Expr("NULL");
			$oilqst2 = new Zend_Db_Expr("NULL");
		} else {
			$oilqst1  = ('Yes'==$post['combo_oil_question1']) ? 'Yes' : 'No';
			$oilqst2  = ('Yes'==$post['combo_oil_question2']) ? 'Yes' : 'No';
		}

		$reconid = trim($post['recon_comments_reconid']);
		$status = trim($post['recon_rmv_review_status']);
		$reason = trim($post['recon_rmv_review_failedreason']);
		$usercomment = trim($post['recon_rmv_review_comments']);
		$reconcomments = trim($post['recon_comments_text']);

		$tblTxt = new Default_Model_ReconText();
		$data = array(
			'recontxt_recon_ID_int' 	   => $reconid,
			'recontxt_Reconciliation_text' => $reconcomments
		);
		$txtid = $tblTxt->insert($data);

		$dataRecon = array(
			'recon_recontxt_ID_int' 				=> $txtid,
			'recon_Status_char' 					=> $status,
			'recon_ReviewComment_text' 				=> $usercomment,
			'recon_ReviewUser_char' 				=> $username,
			'recon_ReviewDate_datetime' 			=> $now,
			'recon_OilQuestion1_enum' 				=> $oilqst1,
			'recon_OilQuestion2_enum' 				=> $oilqst2
		);

		if ($reason!=='Select a reason for your action...') {
			$dataRecon['recon_reconfreas_FailedReason_char'] = $reason;
		}

		//Zend_Registry::get('logdebug')->info('reconID: ' . $reconid);
		//Zend_Registry::get('logrmv')->info('dataRecon: ' . print_r($dataRecon,true));

		$model = new Default_Model_Order;
		$model->logStatusChange($status, array($reconid));

		$where = $model->getAdapter()->quoteInto('recon_ID_int = ?', $reconid);
		$model->update($dataRecon, $where);
	}

	private function submitCommentsData($post)
	{
		// SAVE COMMENTS
		$loadnext = ($post['submit_load_next']==='false') ? false : true;

		$savemode = $post['recon_comments_save_mode'];
		$comments = $post['recon_comments_text'];
		$reconid  = $post['recon_comments_reconid'];

		if ($post['affected_by_oil']=='No') {
			$oilqst1 = new Zend_Db_Expr("NULL");
			$oilqst2 = new Zend_Db_Expr("NULL");
		} else {
			$oilqst1  = ('Yes'==$post['combo_oil_question1']) ? 'Yes' : 'No';
			$oilqst2  = ('Yes'==$post['combo_oil_question2']) ? 'Yes' : 'No';
		}

		$tblTxt = new Default_Model_ReconText();
		$data = array(
			'recontxt_recon_ID_int' 	   => trim($reconid),
			'recontxt_Reconciliation_text' => trim($comments)
		);
		$txtid = $tblTxt->insert($data);

		$username = Zend_Auth::getInstance()->getIdentity()->reconusr_Login_char;
		$status = ($savemode=='draft') ? 'Draft Saved' : 'Pending Peer Review';
		//if ($loadnext) $status = 'Submitted';

		$dataOrder = array(
			'recon_recontxt_ID_int' => $txtid,
			'recon_Status_char' => $status,
			'recon_ReconciledBy_char' => $username,
			'recon_Reconciled_datetime' => date('Y-m-d H:i:s'),

			'recon_FinalReconciledBy_varchar' => $username,
			'recon_FinalReconciledBy_datetime' => date('Y-m-d H:i:s'),

			'recon_OilQuestion1_enum' => $oilqst1,
			'recon_OilQuestion2_enum' => $oilqst2
		);

		$tblOrder = new Default_Model_Order();
		$tblOrder->logStatusChange($status, array($reconid));

		$where = $tblOrder->getAdapter()->quoteInto('recon_ID_int = ?', $reconid);
		$tblOrder->update($dataOrder, $where);

		$reconOrdID = $post['recon_ord_ID_int'];

		////////////
		$stmt = $tblOrder->getAdapter()->prepare("CALL reconcil.usp_PeerReviewRouter(:username,:esid,@outStatus)");
		$stmt->execute(array(
			':username' => $username,
			':esid' => $reconOrdID
		));
		$stmt = $tblOrder->getAdapter()->prepare("SELECT @outStatus;");
        $stmt->execute();
        $outStatus = $stmt->fetchColumn();
        $stmt->closeCursor();
		///////////

        if ($outStatus == 'Reconciled') {
			$data = array(
				'recon_Status_char' => 'Reconciled'
			);
			$where = $tblOrder->getAdapter()->quoteInto('recon_ID_int = ?', $reconid);
			$tblOrder->update($data, $where);
		}

		if (strlen($outStatus) > 0) {
			$stmt = $tblOrder->getAdapter()->prepare("CALL evsmysql.usp_clivndbr_realtimewrapper(?)");
			$stmt->execute(array($reconOrdID));
			$stmt->closeCursor();
		}

		$message = $status. ' successfully on ' . date('m/d/Y H:i:s');
		if ($loadnext===true) {

			$nextreconid = $tblOrder->getNextUnassignedOrderId();

			$dataAssign = array(
				'recon_AssignedTo_char' => $username,
				'recon_Assigned_datetime' => date('Y-m-d H:i:s')
			);

			if (is_numeric($nextreconid)) {
				$where = $tblOrder->getAdapter()->quoteInto('recon_ID_int = ?', $nextreconid);
				$tblOrder->update($dataAssign, $where);
			} else {
				$message = $status . ' We could not assign a new order.  There are no orders left to assign! ';
			}
		}

		return $message;
	}

	/**
	 * Request LPS Research Documents
	 *
	 * @param int $reconId
	 */
	private function _requestLpsFiles($reconId)
	{
	    return;
	    /*
	    $LpsOrder = new Default_Model_LpsOrder();

	    // Skip orders that don't belong to LPS
	    if (!$LpsOrder->isLpsOrder($reconId)) {
	        return false;
	    }

	    $OrderInfo = $LpsOrder->getInfo($reconId);

	    require_once "Lps/Api.php";

	    $Message = Lps_Api::factory("Message");

        $Message->OrderGUID   = $OrderInfo['ClientOrderGUID'];
        $Message->OrderID     = $OrderInfo['ClientOrderID'];
        $Message->MessageEnum = 'ESDeliverResults';
        $Message->send();
        */
	}
}

<?php
/**
 * Controller for QA / Audit management and processing
 *
 */
class QaController extends Zend_Controller_Action
{
    public function init()
    {
        $this->view->baseUrl = $this->getFrontController()->getBaseUrl();
        $this->view->extjsUrl = $this->getInvokeArg('bootstrap')->getOption('extjsurl');
    }

    /**
     * Handle authentication
     *
     */
    public function preDispatch()
    {
        if (!Zend_Auth::getInstance()->hasIdentity()) {
            $this->_redirect('auth');
        }
    }

    /**
     * Load default template in views/scripts/qa
     *
     */
    public function indexAction()
    {
        $this->view->title = 'QA';
    }

    /**
     * Load default template in views/scripts/qa
     *
     */
    public function configAction()
    {
        $this->view->title = 'QA Audit Form Administration';
        $this->view->headScript()->appendFile($this->getFrontController()->getBaseUrl() . '/extjsmanager/loadqaconfig');
    }

    /**
     * Load QA Audit Queue template in views/scripts/queue
     *
     */
    public function queueAction()
    {
        $this->view->title = 'QA Audit Queue';
        $this->view->headScript()->appendFile($this->getFrontController()->getBaseUrl() . '/extjsmanager/loadqaqueue');

        $auditid = $this->_getParam('auditid');
        if ($auditid > 0) {
            $_SESSION['searchauditid'] = $auditid;
        } else {
            $_SESSION['searchauditid'] = 0;
        }
    }

    /**
     * Load Manage Audit Queue template in views/scripts/queue
     *
     */
    public function manageAction()
    {
        $this->view->title = 'Manage Audit Queue';
        $this->view->headScript()->appendFile($this->getFrontController()->getBaseUrl() . '/extjsmanager/loadmanageuditqueue');
        $this->view->headScript()->appendFile($this->getFrontController()->getBaseUrl() . '/visifire_v1.5.8/Visifire.js');
    }

    /**
     * Load questions data
     *
     */
    public function questionsgridAction()
    {
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout->disableLayout();

        $modelQA = new Default_Model_QAData;
        $data = $modelQA->fetchAll()->toArray();

        $response = array();
        $response["count"] = count($data);
        $response["data"] = $data;

        $this->getResponse()->setHeader('Content-Type', 'text/javascript');
        //$this->getResponse()->setBody(print_r($data,true));
        $this->getResponse()->setBody(Zend_Json::encode($response));
    }

    /**
     * Load queues grid
     */
    public function queuesgridAction()
    {
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout->disableLayout();

        $login = Zend_Auth::getInstance()->getIdentity()->reconusr_Login_char;
        $modelQA = new Default_Model_QAData;

        if ($_SESSION['searchauditid'] > 0) {
            $data = $modelQA->getAuditQueuesById($_SESSION['searchauditid']);
        } else {
            $data = $modelQA->getAuditQueues($login);
        }



        //Zend_Registry::get('logdebug')->info(' queuesgrid: ' . print_r($data,true));

        $response = array();
        $response["count"] = count($data);
        $response["data"] = $data;

        $this->getResponse()->setHeader('Content-Type', 'text/javascript');
        //$this->getResponse()->setBody(print_r($data,true));
        $this->getResponse()->setBody(Zend_Json::encode($response));
    }



    public function getorderAction()
    {
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout->disableLayout();

        $auditId = $this->_getParam('auditid');

        $modelQA = new Default_Model_QAData;
        $data = $modelQA->getOrderByAuditId($auditId);

        //Zend_Registry::get('logdebug')->info(' queuesgrid: ' . print_r($data,true));

        $response = array();
        $response["count"] = count($data);
        $response["data"] = $data;

        $this->getResponse()->setHeader('Content-Type', 'text/javascript');
        $this->getResponse()->setBody(Zend_Json::encode($response));
    }



    /**
     * Get all audits
     */
    public function allauditsAction()
    {
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout->disableLayout();

        $filter = ($this->_request->getParam('filter')) ? $this->_request->getParam('filter') : NULL;
        $sortby = ($this->_request->getParam('sort'))?$this->_request->getParam('sort'):'reconqa_Priority_enum';
        $dir = ($this->_request->getParam('dir'))?$this->_request->getParam('dir'):'ASC';

        $modelQA = new Default_Model_QAData;
        $data = $modelQA->getAllAudits($sortby, $dir, $filter);

        $response = array();
        $response["count"] = count($data);
        $response["data"] = $data;

        $this->getResponse()->setHeader('Content-Type', 'text/javascript');
        //$this->getResponse()->setBody(print_r($data,true));
        $this->getResponse()->setBody(Zend_Json::encode($response));
    }

    public function editauditrowAction()
    {
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout->disableLayout();

        $filter = new Zend_Filter_StripTags();

        $auditId = $filter->filter($this->_request->getParam('auditId'));
        $priority = $filter->filter($this->_request->getParam('priority'));
        $login = $filter->filter($this->_request->getParam('login'));

        $data = array();
        if (!empty($priority)) {
            $data['reconqa_Priority_enum'] = $priority;
        }

        if (!empty($login)) {
            $data['reconqa_AssignedTo_char'] = $login;
        }

        if (count($data) > 0) {
            $modelQA = new Default_Model_QAData;
            $modelQA->updateAuditQueue($data, $auditId);
        }

        //Zend_Registry::get('logdebug')->info('data: ' . print_r($data,true));

        $response = array('success' => true, 'result' => "auditId: {$auditId}");
        $this->getResponse()->setHeader('Content-Type', 'text/javascript');
        $this->getResponse()->setBody(Zend_Json::encode($response));
    }

    /**
     * Get answers for given question
     *
     * @param int reconqamngr_ID_int
     */
    public function answersdataAction()
    {
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout->disableLayout();

        $filter = new Zend_Filter_StripTags();
        $id = $filter->filter($this->_request->getParam('id'));

        $modelQA = new Default_Model_QAData;
        $data = $modelQA->getAnswerData($id);

        $response = $data;
        $this->getResponse()->setHeader('Content-Type', 'text/javascript');
        //$this->getResponse()->setBody(print_r($data,true));
        $this->getResponse()->setBody(Zend_Json::encode($response));
    }

    /**
     * Save QA Manager Question/Answer Data
     */
    public function savequestionsAction()
    {
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout->disableLayout();

        $filter = new Zend_Filter_StripTags();
        //Zend_Registry::get('logdebug')->info('RAW POST: ' . print_r($_POST,true));

        $modelQA = new Default_Model_QAData;

        $questionID = $filter->filter($this->_request->getParam('reconqamngr-id'));
        $questionData = array();
        $questionData['reconqamngr_Status_enum'] = 'Enabled';
        $questionData['reconqamngr_Question_char'] = $filter->filter($this->_request->getParam('questiontxt'));
        $questionData['reconqamngr_AppliesToBPO_enum'] = 'Yes';
        $questionData['reconqamngr_AppliesToRMV_enum'] = 'Yes';

        if (false === $this->_request->getParam('isenabled', false)) {
            $questionData['reconqamngr_Status_enum'] = 'Disabled';
        }

        if (false === $this->_request->getParam('applytobpo', false)) {
            $questionData['reconqamngr_AppliesToBPO_enum'] = 'No';
        }

        if (false === $this->_request->getParam('applytormv', false)) {
            $questionData['reconqamngr_AppliesToRMV_enum'] = 'No';
        }

        // if new, create question, get id, else update
        if ($questionID > 0 AND is_numeric($questionID)) {
            // update
            $modelQA->updateQuestionData($questionData, $questionID);
        } else {
            // insert
            $questionID = $modelQA->insert($questionData);
        }

        $answers = $this->_request->getParam('answer');
        $values = $this->_request->getParam('value');
        //Zend_Registry::get('logdebug')->info('answers: ' . print_r($answers,true));
        //Zend_Registry::get('logdebug')->info('values: ' . print_r($values,true));
        if (is_array($answers) AND is_array($values) AND (count($answers) === count($values))) {
            // delete values/answers
            $modelQA->deleteAnswerData($questionID);
            foreach ($answers as $optID => $status) {
                $modelQA->insertAnswerData($questionID, $optID, $values[$optID]);
            }
        }

        //Zend_Registry::get('logdebug')->info('questionData: ' . print_r($questionData,true));

        $response = array('success' => true, 'message' => 'Your data has been saved.');
        $this->getResponse()->setHeader('Content-Type', 'text/javascript');
        $this->getResponse()->setBody(Zend_Json::encode($response));
    }

    public function questionsanswersAction()
    {
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout->disableLayout();

        $modelQA = new Default_Model_QAData;
        $data = $modelQA->getQuestionsAnswers();

        $response = array();
        $response["count"] = count($data);
        $response["data"] = $data;

        $this->getResponse()->setHeader('Content-Type', 'text/javascript');
        //$this->getResponse()->setBody(print_r($data,true));
        $this->getResponse()->setBody(Zend_Json::encode($response));
    }

    public function questionsresultsAction()
    {
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout->disableLayout();

        $filter = new Zend_Filter_StripTags();
        $id = $filter->filter($this->_request->getParam('id'));

        $modelQA = new Default_Model_QAData;
        $data = $modelQA->getQuestionsResults($id);

        $response = array();
        $response["count"] = count($data);
        $response["data"] = $data;

        $this->getResponse()->setHeader('Content-Type', 'text/javascript');
        //$this->getResponse()->setBody(print_r($data,true));
        $this->getResponse()->setBody(Zend_Json::encode($response));
    }

    public function savequeuedataAction()
    {
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout->disableLayout();

        //Zend_Registry::get('logdebug')->info('RAW POST: ' . print_r($_POST,true));

        $filter = new Zend_Filter_StripTags();

        $loadnext = $this->_request->getParam('loadnext');

        $reconqaId = $filter->filter($this->_request->getParam('reconqa_ID'));
        $dataAudit = array();
        $dataAudit['reconqa_QAAuditor_char'] = Zend_Auth::getInstance()->getIdentity()->reconusr_Name_char;
        $dataAudit['reconqa_LoanNumber_char'] = $filter->filter($this->_request->getParam('lsn'));
        $dataAudit['reconqa_Audited_datetime'] = date('Y-m-d H:i:s');
        $dataAudit['reconqa_Address_Street_char'] = $filter->filter($this->_request->getParam('property_addr'));
        $dataAudit['reconqa_Address_City_char'] = $filter->filter($this->_request->getParam('property_city'));
        $dataAudit['reconqa_Address_State_char'] = $filter->filter($this->_request->getParam('property_state'));
        $dataAudit['reconqa_Address_Zip_char'] = $filter->filter($this->_request->getParam('property_zip'));
        $dataAudit['reconqa_EvaluationRating_char'] = $filter->filter($this->_request->getParam('eval_rating'));
        $dataAudit['reconqa_ErrorCodes_char'] = $filter->filter($this->_request->getParam('error_codes'));
        $dataAudit['reconqa_BPORatingComment_char'] = $filter->filter($this->_request->getParam('bpo_rating'));
        $dataAudit['reconqa_BPOValueComment_char'] = $filter->filter($this->_request->getParam('bpo_value'));
        $dataAudit['reconqa_BPOProvider_char'] = $filter->filter($this->_request->getParam('bpo_provider'));
        $dataAudit['reconqa_BPORangeComment_char'] = $filter->filter($this->_request->getParam('bpo_range'));
        $dataAudit['reconqa_BPOValue_char'] = $filter->filter($this->_request->getParam('bpo_value_real'));
        $dataAudit['reconqa_RecommendedCost_char'] = $filter->filter($this->_request->getParam('recom_c_value_real'));
        $dataAudit['reconqa_PriorCost_char'] = $filter->filter($this->_request->getParam('prior_c_value_real'));
        $dataAudit['reconqa_FinalReconComments'] = $filter->filter($this->_request->getParam('recon_comments'));
        if ($loadnext)
            $status = 'Submitted';
        $dataAudit['reconqa_Status_char'] = $status;

        //updateAuditQueue
        $modelQA = new Default_Model_QAData;
        $modelQA->updateAuditQueue($dataAudit,$reconqaId);

        // update reconqares_reconciliationqaresult
        $bpoopts = $_POST['bpoopts'];
        $rmvopts = $_POST['rmvopts'];
        $questions = $_POST['questionstxt'];

        $optkeys = array_keys($questions);
        //Zend_Registry::get('logdebug')->info('optkeys: ' . print_r($optkeys,true));
        if (is_array($optkeys) AND count($optkeys) > 0) {
            foreach ($optkeys as $questionid) {
                $dataResult = array();
                $dataResult['reconqares_reconqa_ID_int'] = $reconqaId;
                $dataResult['reconqares_reconqamngr_ID_int'] = $questionid;
                $dataResult['reconqares_Response_char'] = $questions[$questionid];
                $dataResult['reconqares_RecentBPO_QA_char'] = $bpoopts[$questionid];
                $dataResult['reconqares_RMV_QA_char'] = $rmvopts[$questionid];

                //Zend_Registry::get('logdebug')->info('dataResult: ' . print_r($dataResult,true));
                //Zend_Registry::get('logdebug')->info("q: {$questionTxt}, bpo: {$bpovalue}, rmv: {$rmvvalue}");
                $modelQA->updateQAResults($dataResult);
            }
        }

        if ($loadnext) {
            $qaQueue = new Default_Model_AuditQueue;
            //assign next order
            $sql = "select reconqa_ID_int
                    from reconqa_reconciliationauditqueue_tbl
                    where reconqa_AssignedTo_char is NULL
                    and reconqa_Status_char = 'Loaded'
                    order by reconqa_Priority_enum ASC
                    LIMIT 1";
            $nextqaid_result = $qaQueue->getAdapter()->fetchAll($sql);
            $nextqaid = $nextqaid_result[0]['reconqa_ID_int'];

            //Zend_Registry::get('logdebug')->info('NEXT ID: ' . $nextqaid);

            $username = Zend_Auth::getInstance()->getIdentity()->reconusr_Login_char;
            $dataAssign = array(
                'reconqa_AssignedTo_char' => $username/*,
                'recon_Assigned_datetime' => date('Y-m-d H:i:s')*/
            );
            $where = $qaQueue->getAdapter()->quoteInto('reconqa_ID_int = ?', $nextqaid);
            $qaQueue->update($dataAssign, $where);
        }

        $response = array('success' => true, 'message' => 'Your data has been saved.');
        $this->getResponse()->setHeader('Content-Type', 'text/javascript');
        $this->getResponse()->setBody(Zend_Json::encode($response));
    }

    public function savermvdataAction()
    {
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout->disableLayout();

        $filter = new Zend_Filter_StripTags();

        //Zend_Registry::get('logdebug')->info('USERNAME: ' . Zend_Auth::getInstance()->getIdentity()->reconusr_Login_char);
        //Zend_Registry::get('logdebug')->info('RAW POST: ' . print_r($_POST,true));

        $data = array();
        $data['rmv_prepared_by_char'] = Zend_Auth::getInstance()->getIdentity()->reconusr_Name_char;
        $data['rmv_prepared_date'] = date('Y-m-d H:i:s');

        $dataViolations = array();
        $dataAssessments = array();
        $dataRepairs = array();
        $dataPriorBPO = array();

        $rmvid = $filter->filter($this->_request->getParam('rmv_ID_int'));
        $reconid = $filter->filter($this->_request->getParam('rmv_recon_ID_int'));

        foreach ($_POST as $col => $value) {
            if (stristr($col, 'rmv_')!==false) {
                if ( (strlen($value) > 0) AND (stristr($col, '_date')!==false)) {
                    $data[$col] = date('Y-m-d', strtotime($value));
                } else {
                    $data[$col] = (strlen($value) > 0) ? $filter->filter($value) : NULL;
                }
            }

            if (stristr($col, 'reconrmvvio_')!==false AND $_POST['rmv_misrep_violations_enum']=='Yes') {
                $dataViolations[] = $col;
            }

            if (stristr($col, 'reconrmvassmt_')!==false AND $_POST['rmv_bpo_review_assessment_enum']=='Unreliable') {
                $dataAssessments[] = $col;
            }

            if (stristr($col, 'reconrpradd_')!==false) {
                $dataRepairs[$col] =  $value;
            }

            if (stristr($col, 'reconpriorbpo2_')!==false AND $_POST['reconpriorbpo2_flag']=='1') {
                $dataPriorBPO[] = $col;
            }
        }

        //Zend_Registry::get('logdebug')->info('RMV data: ' . print_r($data,true));
        //Zend_Registry::get('logdebug')->info('RMV violation data: ' . print_r($dataViolations,true));
        //Zend_Registry::get('logdebug')->info('RMV assessment data: ' . print_r($dataAssessments,true));
        //Zend_Registry::get('logdebug')->info('RMV repair data: ' . print_r($dataRepairs,true));
        //Zend_Registry::get('logdebug')->info('RMV dataPriorBPO: ' . print_r($dataPriorBPO,true));

        /*$modelQA = new Default_Model_QAData;
        $modelQA->updateRMVData($data, $rmvid);

        if (count($dataViolations) > 0) {
            $modelQA->updateRMVViolations($dataViolations, $reconid);
        }

        // clear assessments
        //$modelQA->clearRMVAssessments($reconid);
        if (count($dataAssessments) > 0) {
            $modelQA->updateRMVAssessments($dataAssessments, $reconid);
        }

        if (count($dataRepairs) > 0) {
            $modelQA->updateRMVRepairs($dataRepairs, $reconid);
        }*/

        //Zend_Registry::get('logrmv')->info($debug);

        $response = array('success' => true, 'message' => 'Your data has been saved.');
        $this->getResponse()->setHeader('Content-Type', 'text/javascript');
        $this->getResponse()->setBody(Zend_Json::encode($response));
    }

    /**
     * Get RMV Files
     *
     * @since 8/12/2009 - Now also returns raw file data for consumption by a
     *  ExtJs grid.
     */
    public function rmvfilesAction()
    {
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout->disableLayout();

        // Array to store files without HTML formatting (ExtJs grid datasource)
        $relatedFilesData = array();
        $uploadedTypes    = array();

        $esid = $this->_request->getParam('esid');
        $orderid = $this->_request->getParam('orderid');
        $reconid = $this->_request->getParam('reconid');
        $shortform = $this->_request->getParam('shortform');
        $fncfoldernum = $this->_request->getParam('fncFolderNum');
        $is_spo = $this->_request->getParam('is_spo');
        $list = "";
        $listrecon = "";
        $first = true;
        $glue = "";

		$isFNC = (strlen($fncfoldernum) > 0) ? true : false;

        $modelQA = new Default_Model_QAData;
        // get result pdf
        $resultPDF = $modelQA->getRMVResultPDF($orderid);
        if (count($resultPDF) > 0) {
            foreach ($resultPDF as $row) {
                $url = "https://www.evalonline.net" . $row['cliordste_FormPDF_varchar'] . "?OrderID={$orderid}";
                $list .= "{$glue}<a target=\"new\" href=\"{$url}\">{$row['cliordste_CSProductName_varchar']}</a>\n";
                $listrecon .= "{$glue}<a target=\"new\" href=\"{$url}\">{$row['cliordste_CSProductName_varchar']}</a>\n";
                $glue = ", ";

                $relatedFilesData[] = array(
                    'type'          => 'ES BPO Custom Report',
                    'reconId'       => $reconid,
                    'fileId'        => null,
                    'filename'      => null,
                    'fileExtension' => "pdf",
                    'origFilename'  => null,
                    'uploadDate'    => null,
                    'filetype'      => null,
                    'orderId'       => $orderid,
                    'downloadUrl'   => $url
                );
            }
        }


        if (is_numeric($orderid)) {
            $resulturl = "https://www.evalonline.com/esorr/ESBPO_.pdf.php?OrderID={$orderid}";
            $listrecon .= "{$glue}<a href=\"#\" onClick=\"addPDFToPanel('tb-recon','id-bpo-{$orderid}','Completed BPO','{$resulturl}')\">Completed BPO</a>";
            $list .= "{$glue}<a target=_blank href=\"https://www.evalonline.com/esorr/ESBPO_.pdf.php?OrderID={$orderid}\">Completed BPO</a>";
            $glue = ", ";


            $relatedFilesData[] = array(
                'type'          => 'ES BPO Report',
                'reconId'       => $reconid,
                'fileId'        => null,
                'filename'      => $file,
                'fileExtension' => "pdf",
                'origFilename'  => null,
                'uploadDate'    => null,
                'filetype'      => null,
                'orderId'       => $orderid,
                'downloadUrl'   => $resulturl
            );
        }




        // add related files
        $dbFiles  = new Default_Model_UploadFile;
        $rmvfiles = $dbFiles->getRmvResultFiles($esid);
        $baseurl  = $this->getFrontController()->getBaseUrl();
        $hasReasearchFile = false;
        $hasBPOReasearchFile = false;
        $hasMiscReasearchFile = false;
        $hasOAReasearchFile = false;
        $hasOA = false;
        $hasHistoryPro = false;
        $hasRealQuest = false;
        $hasRealQuestCurrent = false;
        $realQuestCurrentCount = 0;
        $hasSubjectMLS = false;
        $reasearchTypes = array('Misc', 'OA Research', 'BPO Research', 'Misc Research', 'HistoryPro', 'RealQuest', 'RealQuest Current');
        $baseUrl = $this->getFrontController()->getBaseUrl();

		//Zend_Registry::get('logdebug')->info('rmvfiles: ' . print_r($rmvfiles,true));

		$resultTableItems = array();

        $i = 0;
        foreach ($rmvfiles as $row) {
            $i++;
            if (in_array($row['upldfl_filetype_char'], $reasearchTypes)) {
            	$hasReasearchFile = true;
            }
            //if ($row['upldfl_filetype_char']=='Original Appraisal' OR $row['upldfl_orig_filename']=='OA.pdf') {
            //	$hasOA = true;
            //}
            if ($row['upldfl_filetype_char']=='HistoryPro') {
            	$hasHistoryPro = true;
            }
            if ($row['upldfl_filetype_char']=='BPO Research') {
            	$hasBPOReasearchFile = true;
            }
            if ($row['upldfl_filetype_char']=='OA Research') {
            	$hasOAReasearchFile = true;
            }
            if ($row['upldfl_filetype_char']=='RealQuest') {
            	$hasRealQuest = true;
            }
            if ($row['upldfl_filetype_char']=='RealQuest Current') {
            	$hasRealQuestCurrent = true;
            	$realQuestCurrentCount++;
            }
            if ($row['upldfl_filetype_char']=='Misc Research') {
            	$hasMiscReasearchFile = true;
            }

            if ($row['upldfl_filedesc_char']=='Subject MLS' OR $row['upldfl_filetype_char']=='Subject MLS') {
            	$hasSubjectMLS = true;
            }

            $ext = strtolower(substr($row['upldfl_uploaded_filename_char'], strrpos($row['upldfl_uploaded_filename_char'], '.') + 1));
            if (!in_array($ext, array('jpg', 'gif', 'png')) AND empty($row['deleted_file_id'])) {
                $url = "{$baseurl}/orderupload/photo/orderid/{$esid}/name/{$row['upldfl_uploaded_filename_char']}";

                if ($ext=='pdf' || $ext=='env') {
                	$upldate = date("m/d/Y", strtotime($row['upldfl_uploaded_timestamp']));
                	$resultTableItems[] = "<a href=\"#\" onClick=\"addPDFToPanel('tb-recon', 'id-{$orderid}-{$i}', '{$row['upldfl_filetype_char']}', '{$url}');\">{$row['upldfl_filetype_char']}</a>";
                    $listrecon .= "{$glue}<a href=\"#\" onClick=\"addPDFToPanel('tb-recon', 'id-{$orderid}-{$i}', '{$row['upldfl_orig_filename']}', '{$url}');\">{$row['upldfl_orig_filename']}</a> ({$row['upldfl_filetype_char']})\n";
                }

                $list .= "{$glue}<a target=\"new\" href=\"{$baseurl}/orderupload/photo/orderid/{$esid}/name/{$row['upldfl_uploaded_filename_char']}\">{$row['upldfl_orig_filename']}</a>\n";

                $uploadedTypes[]    = $row['upldfl_filetype_char'];
                $relatedFilesData[] = array(
                    'type'          => 'Related File',
                    'reconId'       => $row['recondata_recon_ID_int'],
                    'fileId'        => $row['upldfl_ID_int'],
                    'filename'      => $row['upldfl_uploaded_filename_char'],
                    'fileExtension' => $ext,
                    'origFilename'  => $row['upldfl_orig_filename'],
                    'uploadDate'    => $row['upldfl_uploaded_timestamp'],
                    'filetype'      => $row['upldfl_filetype_char'],
                    'orderId'       => $row['recon_ord_ID_int'],
                    'downloadUrl'   => $url
                );
            } else {
            	$fileurl = $baseUrl . '/uploadform/getfile?file=' . $row['upldfl_orig_filename'];
            	$resultTableItems[] = "<a href=\"{$fileurl}\" target=\"_blank\">{$row['upldfl_filetype_char']}</a>";
                $uploadedTypes[]    = $row['upldfl_filetype_char'];
            	$relatedFilesData[] = array(
                    'type'          => 'Related File',
                    'reconId'       => $row['recondata_recon_ID_int'],
                    'fileId'        => $row['upldfl_ID_int'],
                    'filename'      => $row['upldfl_uploaded_filename_char'],
                    'fileExtension' => $ext,
                    'origFilename'  => $row['upldfl_orig_filename'],
                    'uploadDate'    => $row['upldfl_uploaded_timestamp'],
                    'filetype'      => $row['upldfl_filetype_char'],
                    'orderId'       => $row['recon_ord_ID_int'],
                    'downloadUrl'   => $url
                );
            }
        }

        $tblResultFiles = "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">";


		if (!$hasRealQuestCurrent) {
			$tblResultFiles .= "<tr><td style=\"color: red\">ERROR: Missing RealQuest Current file, please upload.</td></tr>";
		}

		//if (!$hasHistoryPro) {
		//	$tblResultFiles .= "<tr><td style=\"color: red\">ERROR: Missing HistoryPro file, please upload.</td></tr>";
		//}

        foreach ($resultTableItems as $itemRow) {
        	$tblResultFiles .= "<tr><td>{$itemRow}</td></tr>";
        }
        $tblResultFiles .= "</table>";
		//Zend_Registry::get('logdebug')->info('tblResultFiles: ' . $tblResultFiles);
		//Zend_Registry::get('logdebug')->info('shortform: ' . $shortform);

        /**
         * @since 8/16/2009 - Add RMV PDF file if order is submitted
         * @todo Determine if we need to add this to the HTML links result as
         *        well
         */
        $OrderModel = new Default_Model_Order();

        if ($OrderModel->getStatusByReconId($reconid) == 'Reconciled') {
            $orderid = $OrderModel->getOrderIdByReconId($reconid);
            $uploadedTypes[] = 'RMV Result';
            $relatedFilesData[] = array(
                'type'          => 'RMV Result',
                'reconId'       => $reconid,
                'fileId'        => null,
                'filename'      => 'RMV_' . $orderid . '.pdf',
                'fileExtension' => 'pdf',
                'origFilename'  => 'RMV_' . $orderid . '.pdf',
                'uploadDate'    => null,
                'filetype'      => 'RMV Result',
                'orderId'       => $orderid,
                'downloadUrl'   => "{$baseurl}/recon/pdf/order/{$orderid}"
            );
        }

		/**
		 * Create an HTML table with valarc and rmv files
		 *
         * @since 2010-02-09
         * @auther tploskina@evalonline.net
         *
         */


        // Get all Valuation Archive files
        $arcfiles = $dbFiles->getValArcFiles($esid);  // $dbFiles instanceof Default_Model_UploadFile

        // Valid BPO File Types
        $bpoFiles = array(
            'BPO',
            'BPO 1',
            'BPO 2',
            'BPO 3',
            'BPO 4',
            'BPO 5',
            'BPO Exterior',
            'BPO Interior',
            'Most Recent BPO'
        );

        // Valid appraisal file types (These are NOT O.A. types)
        $appraisalFiles = array(
            '1004',
            '1004C',
            '1025',
            '1073',
            '1075',
            '2055',
            'Land Only'
        );

		$nPriorBPOs          = 0;
        $appraisalFilesCount = 0;
		$hasPriorRMV         = false;
		$tblOrderFiles       = "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><!-- Errors -->";
		$hasAppraisalWrapper = false;

        // If an appraisal file is older than 7 months, remove it from the files array
        foreach ($arcfiles as $index => $row) {
            if (in_array($row['reconvalarcfl_FileType_char'], $appraisalFiles)) {
                // exclude appraisals older than 7 months
                $dtFile = strtotime($row['reconvalarcfl_FileDate_datetime']);
                $dtSevenMosAgo = (time() - (86400 * 30 * 7));
                if ($dtFile < $dtSevenMosAgo) {
                    //Zend_Registry::get('logdebug')->info('FILE OLDER THAN 7 MOS [REMOVED]: ' . $row['reconvalarcfl_FileType_char'] . ' [' . $row['reconvalarcfl_FileDate_datetime'] . ']');
                    unset($arcfiles[$index]);
                    continue;
                }
            }
        }
        $arcfiles = array_values($arcfiles); // reorder index

		$i = 0;
		foreach ($arcfiles as $row) {
			$i++;


			// if FNC allow sitex OR appraisal
			if (true===$isFNC) {
				if (preg_match('/Appraisal/i', $row['reconvalarcfl_FileType_char']) && !preg_match('/AppraisalPort/', $row['reconvalarcfl_FileType_char'])) {
	            	$hasOA = true;
	            }
	            if (preg_match('/sitex/i', $row['reconvalarcfl_FileType_char'])) {
	            	$hasOA = true;
	            }
			} else {
				if (preg_match('/Appraisal/i', $row['reconvalarcfl_FileType_char']) && !preg_match('/AppraisalPort/', $row['reconvalarcfl_FileType_char'])) {
	            	$hasOA = true;
	            }
			}

            // Count number of BPOs
            if (in_array($row['reconvalarcfl_FileType_char'], $bpoFiles)) {
            	$nPriorBPOs++;
            }

            // Count number of appraisals
            if (in_array($row['reconvalarcfl_FileType_char'], $appraisalFiles)) {
                $appraisalFilesCount++;
            }

            if(stristr($row['reconvalarcfl_FileType_char'], 'rmv') !== FALSE) {
            	$hasPriorRMV = true;
            }

            $ext = strtolower(substr($row['reconvalarcfl_UploadedFilename_char'], strrpos($row['reconvalarcfl_UploadedFilename_char'], '.') + 1));
            $upldate = "Unknown";
			if (strlen($row['reconvalarcfl_FileDate_datetime']) > 0) {
            	$upldate = date("m/d/Y", strtotime($row['reconvalarcfl_FileDate_datetime']));
            }


			if ($row['reconvalarcfl_FileType_char']=='Appraisal Wrapper' || $row['reconvalarcfl_FileType_char']=='ACRP Report') {
				$hasAppraisalWrapper = true;
			}


            if ($ext=='pdf' || $ext=='env') {
            	$pdfurl = "{$baseurl}/orderupload/photo/orderid/{$esid}/name/{$row['reconvalarcfl_UploadedFilename_char']}";
            	$tblOrderFiles .= "<tr><td><a href=\"#\" onClick=\"addPDFToPanel('tb-recon', 'id-{$row['reconvalarcfl_ID_int']}-{$i}', '{$row['reconvalarcfl_FileType_char']} - {$upldate}', '{$pdfurl}');\">{$row['reconvalarcfl_FileType_char']}</a>  ({$upldate})</td></tr>";
			} else {
				$url = $baseUrl . '/uploadform/getfile?file=' . $row['reconvalarcfl_UploadedFilename_char'];
            	$tblOrderFiles .= "<tr><td><a href=\"{$url}\" target=\"_blank\">{$row['reconvalarcfl_FileType_char']}</a> ({$upldate})</td></tr>";
            }
		}

		// Build errors to append to top of list
		$tblOrderFileErrors = "";
		if ($shortform==='No' && !$hasOA) {
            $tblOrderFileErrors .= "<tr><td style=\"color: red\">Error: Long form requested, Origination Appraisal Missing!</td></tr>";
        }

        // Replace errors HTML comment with list of errors

		// Disabled per Rob Covington 5/2/2011
		//$tblOrderFiles = str_replace('<!-- Errors -->', $tblOrderFileErrors, $tblOrderFiles);



		$tblOrderFiles .= "</table>";

   		$tblFiles = "<table border=\"0\" cellpadding=\"2\" cellspacing=\"6\">
		   				<tr>
		   				 <td style=\"font-weight: bold;\">Order Files</td><td style=\"font-weight: bold;\">RMV Result Files</td>
		   				</tr>
		   				<tr>
		   				 <td valign=\"top\">{$tblOrderFiles}</td><td valign=\"top\">{$tblResultFiles}</td>
		   				</tr>
				 	 </table>";

        $response = array(
            'success'              => true,
            'list'                 => $list,
            'listrecon'            => $listrecon,
            'files'                => $relatedFilesData,
            'hasReasearchFile'     => $hasReasearchFile,
            'hasBPOReasearchFile'  => $hasBPOReasearchFile,
            'hasMiscReasearchFile' => $hasMiscReasearchFile,
            'hasOAReasearchFile'   => $hasOAReasearchFile,
            'hasPriorRMVFile'      => $hasPriorRMV,
            'hasRealQuestFile'	   => $hasRealQuest,
            'hasRealQuestCurrent'  => $hasRealQuestCurrent,
            'realQuestCurrentCount'=> $realQuestCurrentCount,
            'hasHistoryPro'		   => $hasHistoryPro,
            'hasOA'		           => $hasOA,
            'hasAppraisalWrapper'  => $hasAppraisalWrapper,
            'tblFiles'			   => $tblFiles,
			'nPriorBPOs'		   => $nPriorBPOs,
            'nPriorAppraisals'     => $appraisalFilesCount,
            'hasSubjectMLS'	   	   => $hasSubjectMLS,
            'allRelatedFileTypes'  => $uploadedTypes
        );

        $this->getResponse()->setHeader('Content-Type', 'text/javascript');
        $this->getResponse()->setBody(Zend_Json::encode($response));
    }

    private function _hasAppraisalFile($esid, &$db)
    {
        $sql ="SELECT COUNT(*) AS cnt
                FROM reconvalarcfl_valuationarchivefile_tbl
                JOIN reconvalarc_valuationarchive_tbl ON reconvalarc_ID_int = reconvalarcfl_reconvalarc_ID_int
                JOIN recon_reconciliationorder_tbl ON recon_ID_int = reconvalarc_recon_ID_int
                WHERE recon_ord_ID_int = ?
                AND reconvalarcfl_FileType_char LIKE '%appraisal%'
                AND reconvalarc_RMVShortForm_char = 'No'";
        $vcount = $db->getAdapter()->fetchOne($sql, array($esid));

        $sql ="SELECT COUNT(*) AS cnt
        FROM upldfl_uploadedfiles_tbl JOIN recondata_upldfl_mtm_tbl USING(upldfl_ID_int)
        JOIN recon_reconciliationorder_tbl ON recondata_recon_ID_int = recon_ID_int
        JOIN reconvalarc_valuationarchive_tbl ON reconvalarc_valuationarchive_tbl.reconvalarc_recon_ID_int = recon_ID_int
        WHERE recon_ord_ID_int = ?
        AND upldfl_filetype_char LIKE '%appraisal%'
        AND reconvalarc_RMVShortForm_char = 'No'";
        $ucount = $db->getAdapter()->fetchOne($sql, array($esid));

        if ( ($vcount > 0) OR ($ucount > 0) ) {
        	return true;
        }

        return false;
    }

    public function rmvrelateddataAction()
    {
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout->disableLayout();

        $orderid = $this->_request->getParam('orderid');
        $addr = $this->_request->getParam('tr_addr');
        $city = $this->_request->getParam('tr_city');
        $state = $this->_request->getParam('tr_state');
        $zip = $this->_request->getParam('tr_zip');

        if (!is_numeric($orderid)) {
        	return '';
        }

		$db = new Default_Model_Order();
        $hasAppraisalFile = $this->_hasAppraisalFile($orderid, $db);

        // get vendor
        $sql = 'SELECT
				 reconvalarc_DestVendor_char
				FROM
				 reconvalarc_valuationarchive_tbl
			    JOIN
			     recon_reconciliationorder_tbl ON recon_ID_int = reconvalarc_recon_ID_int
			 	WHERE
				 recon_ord_ID_int = ?';
        $destVndr = $db->getAdapter()->fetchOne($sql, array($orderid));

        // Look up information about the current user's company
        $currentUserCompany = Default_Model_Company::getCurrentUserCompany();

        $urls = array();

		$truliaUrl = $this->_getTruliaMarketTrendsURL($city, $state);
		$truliaCityStats = $this->_getTruliaCityStatsURL($city,$state);
		$truliaZipStats = $this->_getTruliaZipStatsURL($zip);

        $urls[] = "<a href=\"{$truliaUrl}\" target=_blank>Trulia Market Trends</a>";
		$urls[] = "<a href=\"{$truliaCityStats}\" target='_blank'>Trulia City Stats</a>";
		$urls[] = "<a href=\"{$truliaZipStats}\" target='_blank'>Trulia Zip Stats</a>";

        // History pro data (Hide from Remote Login users and any non-ES company)
        //if ($_SESSION['RemoteLoginSession'] !== true && in_array($currentUserCompany['abbreviation'], array('ES','ES-I','XXX'))) {
        //    $urls[] = '<a href="' . $this->getFrontController()->getBaseUrl() . '/recon/historypro?esorderid=' . $orderid . '" target="_blank">History Pro</a>';
        //}

        // RealQuest Public
        $realquest  = 'http://www.realquest.com/rq/default.aspx?txtSearchAddr=';
        $realquest .= urlencode("{$addr} {$city} {$state}, {$zip}");
        //$urls[] = "<a href=\"{$realquest}\" target=_blank>RealQuest Public</a>";

        // RealQuest Pro (Hide from Remote Login users and any non-ES companies)
        if ($_SESSION['RemoteLoginSession'] !== true && in_array($currentUserCompany['abbreviation'], array('ES','ES-I','XXX'))) {
            $login = $db->getAdapter()->fetchRow("
                SELECT *
                FROM reconcil.corelogicuser_tbl
                ORDER BY
                    LastLogin_datetime LIMIT 1"
            );

            $db->getAdapter()->query("
                UPDATE corelogicuser_tbl
                SET
                    LastLogin_datetime = NOW()
                WHERE
                    UserAccount_varchar = ?",
                $login['UserAccount_varchar']
            );

            $urls[] = "<a href=\"https://www.realquest.com/jsp/rq.jsp?action=login&username={$login['UserAccount_varchar']}&password={$login['UserPassword_varchar']}\" target=_blank>RealQuest Pro</a>";
        }

        // Google
        $googleurl  = "<a href=\"http://www.google.com/search?q=%s\" target=_blank>Google</a>";
        $googleuri = urlencode("{$addr} {$city} {$state} {$zip}");
        $urls[] = sprintf($googleurl, $googleuri);

        // Google Map (Force Satellite View: t=h in URI // t=m for map view)
        $gmapurl = "<a href=\"http://maps.google.com/maps?q=%s&t=h\" target=_blank>Google Map</a>";
        $gmapdirectlink = "http://maps.google.com/maps?q=%s&t=h";
        $gmapuri = urlencode("{$addr} {$city} {$state} {$zip}");
        $gmaphref = sprintf($gmapurl, $gmapuri);
        $gmapdirectlink = sprintf($gmapdirectlink, $gmapuri);
        $urls[] = $gmaphref;

		// MLS Cloud
		$urls[] = "<a href=\" http://www.mlscloud.com/\" target=\"_blank\">MLS Cloud</a>";

        // Analytics Map
        if ($_SESSION['RemoteLoginSession'] !== true) {
            $analyticsurl = '<a href="' . $this->getFrontController()->getBaseUrl() .'/analytics/proxmap/orderid/%s" target="_blank">Analytics Map</a>';
            $urls[] = sprintf($analyticsurl, $orderid);
        }

        // ES Notes (Hide from Remote Login users)
        if ($_SESSION['RemoteLoginSession'] !== true) {
            $notesurl = "<a href=\"http://www.chasevaluations.com/order_notes/index.php?OrderID=%s\" target=_blank>Notes</a>";
            $urls[] = sprintf($notesurl, $orderid);
        }

        $urls[] = '<a href="' . $this->getFrontController()->getBaseUrl() . '/file/static/name/RMV_Reviewer_Manual.pdf" target="_blank">RMV Reviewer Manual</a>';
        $urls[] = '<a href="' . $this->getFrontController()->getBaseUrl() . '/file/static/name/RMV_Review_Reference_Guide.pdf" target="_blank">RMV Review Reference Guide</a>';

        // Location Code
        $tblRecon = new Default_Model_ReconData();
        $locationCode = $tblRecon->getLocationCodeByZip($zip);
        switch ($locationCode) {
            case 'S':
                $locationMsg = '3 mile of the subject property';
                break;

            case 'U':
                $locationMsg = '1 mile of the subject property';
                break;

            case 'R':
                $locationMsg = '5 miles of the subject property';
                break;

            default:
                $locationMsg = '5 miles of the subject property';
                break;
        }

        // gmap opened time
        $gmapOpenedTime = 0;
        if (array_key_exists('rmv-gmap-opened', $_SESSION)) {
            $gmapOpenedTime = $_SESSION['rmv-gmap-opened'][$orderid];
        }

        $time = time();
        $gmapTimeDiff = $time - $gmapOpenedTime;
        if ($gmapTimeDiff > 3600) {
            $_SESSION['rmv-gmap-opened'][$orderid] = 0;
        }

        $response = array(
            'success'           => true, 
            'urls'              => $urls, 
            'gmaplink'          => $gmapdirectlink, 
            'locationMsg'       => $locationMsg,
            'gmapOpenedTime'    => $gmapOpenedTime
        );
        $this->getResponse()->setHeader('Content-Type', 'text/javascript');
        //$this->getResponse()->setBody(print_r($response,true));
        $this->getResponse()->setBody(Zend_Json::encode($response));
    }

	private function _getTruliaZipStatsURL($zip)
    {
		//getZipCodeStats Call
        $post_url="http://api.trulia.com/webservices.php?library=TruliaStats&function=getZipCodeStats&zipCode=".urlencode($zip)."&apikey=aueht37hk288ftke9bg4jhsm";
		//return $post_url;

        $ch = curl_init();
        $header = array();
        $header[] = "Content-type: text/xml";
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        curl_setopt($ch, CURLOPT_URL, $post_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);

        $output = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        if ($output === false || $info['http_code'] != 200) {
            return '#';
        } else {
          $xml = simplexml_load_string($output);
		  return $xml->response->TruliaStats->location->searchResultsURL;
          $trendurl = ($xml->response->TruliaStats->location->searchResultsURL) ? $xml->response->TruliaStats->location->searchResultsURL : '';
			 if (strstr($trendurl,'http://www.trulia.com') === false)
				$trendurl = 'http://www.trulia.com'.$trendurl;
          return $trendurl;
        }
        return '#';
    }

	private function _getTruliaCityStatsURL($city, $state)
    {
		//  just in case there's crappy city data
		$pos=strpos($city,",");
		if ($pos !== false) {
			$city = substr($city,0,$pos);
		}

		//cityStats Call
        $post_url="http://api.trulia.com/webservices.php?library=TruliaStats&function=getCityStats&city=".urlencode($city)."&state=".$state."&apikey=aueht37hk288ftke9bg4jhsm";
        $ch = curl_init();
        $header = array();
        $header[] = "Content-type: text/xml";
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        curl_setopt($ch, CURLOPT_URL, $post_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);

        $output = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        if ($output === false || $info['http_code'] != 200) {
            return '#';
        } else {
          $xml = simplexml_load_string($output);
          $trendurl = ($xml->response->TruliaStats->location->searchResultsURL) ? $xml->response->TruliaStats->location->searchResultsURL : '';
			 if (strstr($trendurl,'http://www.trulia.com') === false)
				$trendurl = 'http://www.trulia.com'.$trendurl;
          return $trendurl;
        }
        return '#';
    }

    private function _getTruliaMarketTrendsURL($city, $state)
    {
		//  just in case there's crappy city data
		$pos=strpos($city,",");
		if ($pos !== false) {
			$city = substr($city,0,$pos);
		}

		//cityStats Call
        $post_url="http://api.trulia.com/webservices.php?library=TruliaStats&function=getCityStats&city=".urlencode($city)."&state=".$state."&apikey=aueht37hk288ftke9bg4jhsm";
        $ch = curl_init();
        $header = array();
        $header[] = "Content-type: text/xml";
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        curl_setopt($ch, CURLOPT_URL, $post_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);

        $output = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        if ($output === false || $info['http_code'] != 200) {
            return '#';
        } else {
          $xml = simplexml_load_string($output);
          $trendurl = ($xml->response->TruliaStats->location->cityGuideURL)?$xml->response->TruliaStats->location->cityGuideURL.'market-trends/' : '';
			 if (strstr($trendurl,'http://www.trulia.com') === false)
					$trendurl = 'http://www.trulia.com'.$trendurl;
          return $trendurl;
        }
        return '#';
    }

    public function tmpAction()
    {
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout->disableLayout();

        $modelQA = new Default_Model_QAData;
        $data = $modelQA->getRMVData(1);


        //{name: 'reconqa_FinalReconComments'},
        $str = "{name: '%s'%s},\n";
        $body = '';
        foreach ($data[0] as $key => $value) {
            $typedate = '';
            if (false!==stristr($key, '_date')) {
                $typedate = ", type: 'date', dateFormat: 'Y-m-d H:i:s'";
            }

            $body .= sprintf($str, $key, $typedate);
        }

        $this->getResponse()->setHeader('Content-Type', 'text/html');
        //$this->getResponse()->setBody(print_r($data,true));
        $this->getResponse()->setBody($body);
    }

    public function doassignmentAction()
    {
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $jsondata = $this->_request->getPost('ids');
        $ids = Zend_Json::decode($jsondata);
        $username = $this->_request->getPost('fm_user');


        $tblOrder = new Default_Model_AuditQueue();
        $dataAssign = array(
            'reconqa_AssignedTo_char' => $username
        );
        $where = 'reconqa_ID_int in ('.join(",",$ids).')';

        //$writer = new Zend_Log_Writer_Stream(dirname(__FILE__).'/../../logs/debug.log');
        //$logger = new Zend_Log($writer);
        //$logger->info('do assignment (where) : '.$where);

        $tblOrder->update($dataAssign, $where);

        $response = array('success' => true, 'message' => 'Updated');

        $this->getResponse()->setHeader('Content-Type', 'text/javascript');
        $this->getResponse()->setBody(Zend_Json::encode($response));
    }

    public function dosetpriorityAction()
    {
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();

        $jsondata = $this->_request->getPost('ids');
        $ids = Zend_Json::decode($jsondata);
        $priority = $this->_request->getPost('fm_priority');


        $tblOrder = new Default_Model_AuditQueue();
        $dataAssign = array(
            'reconqa_Priority_enum' => $priority
        );
        $where = 'reconqa_ID_int in ('.join(",",$ids).')';

        //$writer = new Zend_Log_Writer_Stream(dirname(__FILE__).'/../../logs/debug.log');
        //$logger = new Zend_Log($writer);
        //$logger->info('do assignment (where) : '.$where);

        $tblOrder->update($dataAssign, $where);

        $response = array('success' => true, 'message' => 'Updated');

        $this->getResponse()->setHeader('Content-Type', 'text/javascript');
        $this->getResponse()->setBody(Zend_Json::encode($response));
    }

    public function generateauditreportAction()
    {
        require_once APPLICATION_PATH . '/../library/FPDF/fpdf.php';

        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout->disableLayout();

        //reconqa_reconciliationauditqueue_tbl
        $qaid = $this->_request->getParam('qaid');
        $tbl = new Default_Model_AuditQueue();
        $row = $tbl->find($qaid)->toArray();
        $data = $row[0];

        //print_r($data);
        //return;

        $tblQA = new Default_Model_QAData();
        $results = $tblQA->getQuestionsResults($qaid);
        //print_r($results);
        //return;

        $pdf = new FPDF('P','mm','A4');
        $pdf->AddPage();

        $cellHeight = 5;
        $col1W = 40;
        $col2W = 60;
        $col3W = 30;
        $col4W = 40;

        $pdf->SetFont('Arial','B',10);
        $pdf->Cell($col1W,$cellHeight,'LSN#:');
        $pdf->SetFont('Arial','',10);
        $pdf->Cell($col2W,$cellHeight,$data['reconqa_LoanNumber_char'],'B',0,'L');
        $pdf->SetFont('Arial','B',10);
        $pdf->Cell($col3W,$cellHeight,'QA Audit Date:');
        $pdf->SetFont('Arial','',10);
        $pdf->Cell($col4W,$cellHeight, date('Y-m-d',strtotime($data['reconqa_Audited_datetime'])),"B",0,'C');
        $pdf->Ln();
        $pdf->SetFont('Arial','B',10);
        $pdf->Cell($col1W,$cellHeight,'Date of BPO Review:');
        $pdf->SetFont('Arial','',10);
        $pdf->Cell($col2W,$cellHeight,date('Y-m-d',strtotime($data['reconqa_Loaded_datetime'])), 'B');
        $pdf->SetFont('Arial','B',10);
        $pdf->Cell($col3W,$cellHeight,'QA Auditor:');
        $pdf->SetFont('Arial','',10);
        $pdf->Cell($col4W,$cellHeight, $data['reconqa_QAAuditor_char'], 'B');
        $pdf->Ln();
        $pdf->SetFont('Arial','B',10);
        $pdf->Cell($col1W,$cellHeight,'Auditor:');
        $pdf->SetFont('Arial','',10);
        $pdf->Cell($col2W,$cellHeight,$data['reconqa_AssignedTo_char'],'B');
        $pdf->SetFont('Arial','B',10);
        $pdf->Cell($col3W,$cellHeight,'Second Sign:');
        $pdf->SetFont('Arial','',10);
        $pdf->Cell($col4W,$cellHeight, '?');
        $pdf->Ln();
        $pdf->SetFont('Arial','B',10);
        $pdf->Cell($col1W,$cellHeight,'Property Address:');
        $pdf->SetFont('Arial','',10);
        $pdf->Cell($col2W,$cellHeight,$data['reconqa_Address_Street_char'], 'B');
        $pdf->SetFont('Arial','B',10);
        $pdf->Cell($col3W,$cellHeight,'City:');
        $pdf->SetFont('Arial','',10);
        $pdf->Cell($col4W,$cellHeight, $data['reconqa_Address_City_char'], 'B');
        $pdf->Ln();
        $pdf->SetFont('Arial','B',10);
        $pdf->Cell($col1W,$cellHeight,'County:');
        $pdf->SetFont('Arial','',10);
        $pdf->Cell(30,$cellHeight,'?', 'B');
        $pdf->SetFont('Arial','B',10);
        $pdf->Cell($col3W,$cellHeight,'ST:');
        $pdf->SetFont('Arial','',10);
        $pdf->Cell(18,$cellHeight, $data['reconqa_Address_State_char'],'B');
        $pdf->Ln();
        $pdf->SetFont('Arial','B',10);
        $pdf->Cell($col1W,$cellHeight,'Property Type:');
        $pdf->SetFont('Arial','',10);
        $pdf->Cell($col2W,$cellHeight,'?');
        $pdf->SetFont('Arial','B',10);
        $pdf->Cell($col3W,$cellHeight,'Zip:');
        $pdf->SetFont('Arial','',10);
        $pdf->Cell($col4W,$cellHeight, $data['reconqa_Address_Zip_char']);
        $pdf->Ln();
        $pdf->Ln();

        $pdf->SetFont('Arial', 'B', 10);

        $scoreBPO = 0;
        $scoreRMV = 0;

        $wQuestion = 135;
        $wOpt = 20;
        $height = 6;

        $x = $pdf->GetX();
        $y1 = $pdf->GetY();
        $pdf->MultiCell($wQuestion, $height, 'Questions');
        $y2 = $pdf->GetY();
        $yH = $y2 - $y1;
        $pdf->SetXY($x + $wQuestion, $pdf->GetY() - $yH);

        $pdf->Cell($wOpt, $height, 'BPO');
        $pdf->Cell($wOpt, $height, 'RMV');

        $pdf->Ln();
        $pdf->Ln();

        $i = 1;
        foreach ($results as $row) {
            $question = "{$i}) {$row['reconqamngr_Question_char']}";
            $y1 = $pdf->GetY();
            $pdf->MultiCell($wQuestion, $height, $question);
            $y2 = $pdf->GetY();
            $yH = $y2 - $y1;

            $pdf->SetXY($x + $wQuestion, $pdf->GetY() - $yH);

            $pdf->Cell($wOpt, $yH, $row['optbpo']);
            $pdf->Cell($wOpt, $yH, $row['optrmv']);

            $pdf->Ln();

            $scoreBPO += $row['bpovalue'];
            $scoreRMV += $row['rmvvalue'];

            $i++;
        }

        // score
        $pdf->SetX($x + $wQuestion);
        $pdf->Cell($wOpt, 6, 'Score'); //bpo
        $pdf->Cell($wOpt, 6, 'Score'); //rmv
        $pdf->Ln();
        $pdf->SetX($x + $wQuestion);
        $pdf->Cell($wOpt, 6, $scoreBPO);
        $pdf->Cell($wOpt, 6, $scoreRMV);

        $pdf->Ln();

        // 170: 40,60,30,40
        $height = 6;
        $widths = array(55,45,35,35);
        $pdf->Cell($widths[0], 6, 'Evaluation is rated: ');
        $pdf->Cell($widths[1], 6, $row['reconqa_EvaluationRating_char'], 'B');
        $pdf->Cell($widths[2], 6, 'Error Codes: ');
        $pdf->Cell($widths[3], 6, $row['reconqa_ErrorCodes_char'], 'B');
        $pdf->Ln();
        $pdf->Cell($widths[0], 6, 'BPO is rated: ');
        $pdf->Cell($widths[1], 6, $row['reconqa_BPORatingComment_char'], 'B');
        $pdf->Ln();
        $pdf->Cell($widths[0], 6, 'BPO Value: ');
        $pdf->Cell($widths[1], 6, $row['reconqa_BPOValue_char'], 'B');
        $pdf->Cell($widths[2], 6, 'BPO Value: ');
        $pdf->Cell($widths[3], 6, $row['reconqa_BPOProvider_char'], 'B');
        $pdf->Ln();
        $pdf->Cell($widths[0], 6, 'BPO Range: ');
        $pdf->Cell($widths[1], 6, $row['reconqa_BPORangeComment_char'] . '  ', 'B');
        $pdf->Cell($widths[2], 6, 'BPO Value: ');
        $pdf->Cell($widths[3], 6, $row['reconqa_BPOValueComment_char'], 'B');
        $pdf->Ln();
        $pdf->Cell($widths[0], 6, 'Recommended C value: ');
        $pdf->Cell($widths[1], 6, '', 'B');
        $pdf->Cell($widths[2], 6, 'Recommended C: ');
        $pdf->Cell($widths[3], 6, $row['reconqa_RecommendedCost_char'], 'B');
        $pdf->Ln();
        $pdf->Cell($widths[0], 6, 'Recommended C value range: ');
        $pdf->Cell($widths[1], 6, '', 'B');
        $pdf->Cell($widths[2], 6, 'Prior C: ');
        $pdf->Cell($widths[3], 6, $row['reconqa_PriorCost_char'], 'B');

        $pdf->Ln();
        $pdf->Ln();
        $pdf->Cell(100, 6, 'Reconcilliation Comments');
        $pdf->Ln();
        $pdf->MultiCell(170, 6, $row['reconqa_FinalReconComments']);

        $pdfData = $pdf->Output('', 'S');
        $filename = 'qa_audit.pdf';

        $response = $this->getResponse();
        $response->setHeader("Pragma","public",true);
        $response->setHeader('Expires',0);
        $response->setHeader("Cache-Control","must-revalidate, post-check=0, pre-check=0",true);
        $response->setHeader('Content-Type', "application/pdf", true);

        $user_agent = strtolower ($_SERVER["HTTP_USER_AGENT"]);
        if ((is_integer(strpos($user_agent,"msie"))) && (is_integer(strpos($user_agent,"win"))))
        {
          $response->setHeader("Content-Disposition","filename=".$filename.";");
        } else {
          $response->setHeader("Content-Disposition","attachment; filename=".$filename.";" );
        }
        $response->setHeader("Content-Transfer-Encoding", "binary");
        $response->setHeader("Content-Length", strlen($pdfData));

        $response->sendHeaders();
        $response->setBody($pdfData);
    }
}


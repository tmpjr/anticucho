<?php

class ExtjsmanagerController extends Zend_Controller_Action
{
	public function init()
	{
		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();
		$this->view->extjsUrl = $this->getInvokeArg('bootstrap')->getOption('extjsurl');
		$this->_helper->layout->disableLayout();

		if (is_object(Zend_Auth::getInstance()->getIdentity())) {
			$userId = Zend_Auth::getInstance()->getIdentity()->reconusr_ID_int;
		} else {
			$userId = 0;
		}
		//
		$ACLModule = new Default_Model_Acl();

		$this->view->allowedModules = $ACLModule->getAllowedModules($userId);
		
		$this->view->isSystemMaintenance = $this->getInvokeArg('bootstrap')->getOption('system_maintenance');
	}

	/**
	 * Load RMV Form JavaScript Files
	 */
	public function loadscriptsAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->canModifyFiles = Default_Model_Acl::userAllowed('rmv_file_manager', null, false);
		$this->view->canAddException = Default_Model_Acl::userAllowed('rmv_log_exception');
		$this->view->canUpdateAddress = Default_Model_Acl::userAllowed('rmv_change_address', null, false);
		//$this->view->canUpdateAddress = true; //for debugging

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();
		$this->view->userFullName = Zend_Auth::getInstance()->getIdentity()->reconusr_Name_char;
		$this->view->userLogin = Zend_Auth::getInstance()->getIdentity()->reconusr_Login_char;
		$this->view->userId = Zend_Auth::getInstance()->getIdentity()->reconusr_ID_int;
		$this->view->userAclRole = Zend_Auth::getInstance()->getIdentity()->reconusr_reconaclrl_ID_int;
		$this->view->userCo = Zend_Auth::getInstance()->getIdentity()->reconusr_co_ID_int;
		$this->view->minCmtLn = 25;
		if (Zend_Auth::getInstance()->getIdentity()->reconusr_co_ID_int==2) {
			$this->view->minCmtLn = 1; 
		}

		$this->view->isReview = ($this->getRequest()->getParam('mode')=='review') ? 1 : 0;
		$this->view->isPeerReview = ($this->getRequest()->getParam('mode')=='peerreview') ? 1 : 0;

		$this->view->reviewReadOnly = 'true';
		if (true===$this->view->isReview) {
			$this->view->reviewReadOnly = 'false';
		}

        $this->view->remoteSession = 'false';
		if ($_SESSION['RemoteLoginSession'] === true) {
		    $this->view->remoteSession = 'true';
		}

		$this->renderScript('FormCommentBuilder.js');
		$this->renderScript('WindowButtonMenu.js');
		$this->renderScript('FormRecon.js');
		$this->renderScript('PanelGenericHeader.js');
		$this->renderScript('PanelReconComments.js');
		$this->renderScript('GridRecon.js');
		$this->renderScript('FormAncillaryData.js');
		$this->renderScript('GridWorkqueue.js');
		$this->renderScript('FormUpload.js');
		$this->renderScript('PanelOrderPhotos.js');
		$this->renderScript('PanelRMVSummary.js');
		$this->renderScript('FormRMV.js');
		$this->renderScript('Viewport.js');

		// new file manager files
		$this->renderScript('GridFileManager.js');
		$this->renderScript('WindowFileManager.js');
		$this->renderScript('Combos.js');
	}

	public function loadloginscriptsAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();

		$this->renderScript('Login.js');
	}
	
	public function loadvipscriptsAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();

		$this->view->username = Zend_Auth::getInstance()->getIdentity()->reconusr_Login_char;

		$this->renderScript('WindowVIPAccess.js');
	}

    public function forgotpasswordAction()
    {
        $this->_helper->viewRenderer->setNoRender();
        $this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
        $this->getResponse()->setHeader('Content-Type', 'text/javascript');

        $this->view->baseUrl = $this->getFrontController()->getBaseUrl();

        $this->renderScript('WindowForgotPassword.js');
    }

	public function loadmenuscriptsAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		
		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();

		$this->renderScript('WindowButtonMenu.js');
	}

	public function loadmapperAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();

		$this->renderScript('DataUser.js');
		$this->renderScript('PanelFileColumnMapper.js');
	}

	public function loaduploadformAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();

        //$this->renderScript('WindowButtonMenu.js');
        //$this->renderScript('PanelQAHeader.js');

		//$this->renderScript('PanelUploadForm2.js');
	}

	public function loadorderuploadAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();

		//$this->renderScript('DataUser.js');
		$this->renderScript('GridColumnMapper.js');
		$this->renderScript('WindowButtonMenu.js');
		$this->renderScript('PanelFileUploader.js');
	}

	public function loaduseradminAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();

		$ACL = new Default_Model_Acl();
		$this->view->allRoles = $ACL->getAllRoles();


        $this->renderScript('PanelGenericHeader.js');
		$this->renderScript('PanelACL.js');
		$this->renderScript('FormUser.js');
		$this->renderScript('GridModuleConfig.js');
		$this->renderScript('WindowButtonMenu.js');
		$this->renderScript('PanelUserAdmin.js');
		$this->renderScript('WinFormVIPAdmin.js');
	}

	public function loadloadedordersAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();

		$this->renderScript('GridLoadedOrders.js');
		$this->renderScript('WindowButtonMenu.js');
		$this->renderScript('PanelLoadedOrders.js');
	}

	public function loadreconciledordersAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();

		$this->renderScript('GridReconciledOrders.js');
		$this->renderScript('WindowButtonMenu.js');
		$this->renderScript('PanelReconciledOrders.js');
		$this->renderScript('Util.js');
	}

	public function loadrmvretrieveresultsAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();

		$this->renderScript('GridRMVRetrievedResults.js');
		$this->renderScript('WindowButtonMenu.js');
		$this->renderScript('PanelRmvRetrievedResults.js');
		$this->renderScript('Util.js');
	}

	public function loadmanagequeuesAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$companyInfo =  Default_Model_Company::getCurrentUserCompany();
		$this->view->companyInfo = json_encode($companyInfo);
		$this->view->companyId   = $companyInfo['id'];
		$this->view->companyAbbr = $companyInfo['abbreviation'];

		$this->view->queueButtonText = 'Disable Queues';
		$tblSetting = new Default_Model_Setting();
		if ($tblSetting->getSettingByName('QUEUES_DISABLE_GETORDER')===1) {
			$this->view->queueButtonText = 'Enable Queues';
		}

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();

		//$this->renderScript('DataUser.js');
		$this->renderScript('FormMQAssignment.js');
		$this->renderScript('FormMQPriority.js');
		$this->renderScript('FormMQStatus.js');
		$this->renderScript('GridManageWorkqueue.js');
		$this->renderScript('WindowButtonMenu.js');
		$this->renderScript('PanelManageQueues.js');
		$this->renderScript('Util.js');
	}

	public function loadqaconfigAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();

		$this->renderScript('WindowButtonMenu.js');
		$this->renderScript('FormQAConfig.js');
		$this->renderScript('PanelQAHeader.js');

	}

	public function loadqaqueueAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();
		$this->view->userFullName = Zend_Auth::getInstance()->getIdentity()->reconusr_Name_char;
		$this->view->userId = Zend_Auth::getInstance()->getIdentity()->reconusr_ID_int;

		$this->renderScript('WindowButtonMenu.js');
		$this->renderScript('FormQAQueue.js');
		$this->renderScript('FormUpload.js');
		$this->renderScript('FormRMV.js');
		$this->renderScript('GridQAQueue.js');
		$this->renderScript('PanelQAHeader.js');
	}

	public function loadmanageuditqueueAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();
		$this->view->userFullName = Zend_Auth::getInstance()->getIdentity()->reconusr_Name_char;
		$this->view->userId = Zend_Auth::getInstance()->getIdentity()->reconusr_ID_int;

		$this->renderScript('FormMAuditQAssignment.js');
		$this->renderScript('FormMAuditQPriority.js');
		$this->renderScript('WindowButtonMenu.js');
		$this->renderScript('PanelQAHeader.js');
		$this->renderScript('GridManageAuditQueue.js');
	}


	/**
	 * Load Archive Upload JavaScript
	 */
	public function loadarchiveAction()
	{
	    $this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();

		$this->renderScript('WindowButtonMenu.js');
		$this->renderScript('PanelArchiveHeader.js');
		$this->renderScript('FormArchiveLoader.js');
	}


	/**
	 * Load Search JavaScript
	 */
	public function loadsearchAction()
	{
	    $this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();

		$this->renderScript('Util.js');
		$this->renderScript('WindowButtonMenu.js');
		$this->renderScript('PanelGenericHeader.js');
		$this->renderScript('FormSearch.js');
		$this->renderScript('GridSearchResults.js');
	}

	/**
	 * Load Reporting JavaScript
	 */
	public function reportingAction()
	{
	    $this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();

		$this->renderScript('Util.js');
		$this->renderScript('WindowButtonMenu.js');
		$this->renderScript('PanelGenericHeader.js');
		$this->renderScript('PanelDashboardReport.js');
	}



	/**
	 * Load Manage Archive Data
	 */
	public function loadmanagearchivesAction()
	{
        $this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();

		$this->renderScript('WindowButtonMenu.js');
		$this->renderScript('PanelGenericHeader.js');
		$this->renderScript('GridArchiveData.js');
	}


    /**
     * RMV Summary Archive
     */
	public function loadrmvsummaryAction()
	{
	    $this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();

		$this->renderScript('WindowButtonMenu.js');
		$this->renderScript('PanelGenericHeader.js');
		$this->renderScript('FormRMVSummaryReject.js');
		$this->renderScript('PanelRMVSummary.js');
	}


	/**
	 * RMV History
	 */
	public function loadrmvhistoryAction()
	{
	    $this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();

		$this->renderScript('WindowButtonMenu.js');
		$this->renderScript('PanelGenericHeader.js');
		$this->renderScript('GridRMVHistory.js');
	}

	/**
	  * CMS RMV Result
	  */
	public function loadcmsrmvresultAction()
	{
		 $this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();

		$this->renderScript('WindowButtonMenu.js');
		$this->renderScript('PanelGenericHeader.js');
		$this->renderScript('FormRMVSummaryReject.js');
		$this->renderScript('PanelCMSSummary.js');
	}


	public function loadarcexepctionsAction()
	{
	    $this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();

		$this->renderScript('WindowButtonMenu.js');
		$this->renderScript('PanelGenericHeader.js');
		$this->renderScript('GridArcExceptions.js');
		$this->renderScript('Util.js');
	}


	public function loadsupplementalAction()
	{
	    $this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();

		$this->renderScript('WindowButtonMenu.js');
		$this->renderScript('PanelGenericHeader.js');
	}

	public function loadrmvdataentryAction()
	{
	    $this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();

		$this->renderScript('PanelGenericHeader.js');
		$this->renderScript('WindowButtonMenu.js');
		$this->renderScript('FormRMVDataEntry.js');
		$this->renderScript('GridFileManager.js');
		$this->renderScript('WindowFileManager.js');
		$this->renderScript('Combos.js');
	}
	public function loadhelpAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->view->addScriptPath(APPLICATION_PATH . '/views/_extjs/');
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();
	}
}
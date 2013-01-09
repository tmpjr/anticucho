<?php

class AuthController extends Zend_Controller_Action
{

	public function init()
	{
		Eval_Vip::setStatus(Eval_Vip::VIP_REQUIRE_YES_VALID_NO);
		
		/* Initialize action controller here */
		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();
		$this->view->extjsUrl = $this->getInvokeArg('bootstrap')->getOption('extjsurl');
	}

	public function indexAction()
	{
		// action body
		$this->view->title = "Eval Reconciler - Login";
		$baseUrl = $this->getFrontController()->getBaseUrl();
		
		$this->view->enableLoginTimer = false;

		$this->view->headLink()->appendStylesheet($baseUrl.'/extjs-ux/logindialog/css/overrides.css');
		$this->view->headLink()->appendStylesheet($baseUrl.'/extjs-ux/logindialog/css/flags.css');

		$this->view->headScript()->appendFile($baseUrl . '/extjs-ux/logindialog/js/overrides.js');
		$this->view->headScript()->appendFile($baseUrl . '/extjs-ux/logindialog/js/Ext.ux.form.IconCombo.js');
		$this->view->headScript()->appendFile($baseUrl . '/extjs-ux/logindialog/js/Ext.ux.form.LoginDialog.js');
		$this->view->headScript()->appendFile($baseUrl . '/extjsmanager/loadloginscripts');
	}

	public function accessdeniedAction()
	{
		$this->view->title = "Eval Reconciler - Access Denied";
		$this->view->headScript()->appendFile($this->getFrontController()->getBaseUrl() . '/extjsmanager/loadmenuscripts');
	}

	public function loginAction()
	{
		$this->_helper->layout->disableLayout();
		$this->_helper->viewRenderer->setNoRender();
		$request = $this->getRequest();
		
		Eval_Vip::clear();

		$bootstrap = $this->getInvokeArg('bootstrap');
		$dbAdapter = $bootstrap->getResource('db');

		$logger = Zend_Registry::get('logdebug');

		if ($request->isPost()) {
			$filter = new Zend_Filter_StripTags();
			$postUsername = $filter->filter($this->_request->getPost("username"));
			$postPassword = $filter->filter($this->_request->getPost("password"));

			

			$authAdapter = new Zend_Auth_Adapter_DbTable( $dbAdapter, 
				"reconusr_reconuser_tbl", "reconusr_Login_char", "reconusr_Passwd_char",
				"SHA1(?)"
				);			
				
			$authAdapter->setIdentity($postUsername);
      		$authAdapter->setCredential($postPassword);
            
			$select = $authAdapter->getDbSelect();
			$select->where('reconusr_Active_bool=1');

			Zend_Auth::getInstance()->clearIdentity();
			$result = $authAdapter->authenticate();

			switch ($result->getCode()) {
				case Zend_Auth_Result::FAILURE_IDENTITY_NOT_FOUND:
				//case Zend_Auth_Result::FAILURE_CREDENTIAL_INVALID:
					$logger->log("AUTH FAILURE: Username [{$postUsername}] not found!", Zend_Log::WARN);
					$response = (array(
						'success'=> false,
						'message' => 'Invalid username or password.  Please try again.'
					));
					Zend_Auth::getInstance()->clearIdentity();
					break;
				
				case Zend_Auth_Result::FAILURE_CREDENTIAL_INVALID:
					$logger->log("AUTH FAILURE: Username [{$postUsername}] INCORRECT PASSWORD!", Zend_Log::WARN);
					$response = (array(
						'success'=> false,
						'message' => 'Invalid username or password.  Please try again.'
					));
					
					$table = new Default_Model_UserData();
					$data = $table->fetchRow(
    					$table->select()->where('reconusr_Login_char = ?', $postUsername)
    				);
					
					if ($data->reconusr_ID_int > 0) {
						$loginlog = new Default_Model_LoginLog();
						$loginlog->insert(array(
							'reconusrlog_reconusr_ID_int' 		=> $data->reconusr_ID_int,
							'reconusrlog_LoginSuccess_tint'		=> 0,
							'reconusrlog_IP_varchar'			=> $_SERVER['REMOTE_ADDR']
						));
					}
					
					Zend_Auth::getInstance()->clearIdentity();
					break;

				case Zend_Auth_Result::SUCCESS:
					$logger->log("AUTH SUCCESS: $postUsername", Zend_Log::INFO);

					$data = $authAdapter->getResultRowObject(null, "reconusr_Passwd_char");
					$storage = Zend_Auth::getInstance()->getStorage();
					$storage->write($data);

					$loginlog = new Default_Model_LoginLog();
					$idLoginLog = $loginlog->insert(array(
						'reconusrlog_reconusr_ID_int' 		=> $data->reconusr_ID_int,
						'reconusrlog_LoginSuccess_tint'		=> 1,
						'reconusrlog_IP_varchar'			=> $_SERVER['REMOTE_ADDR']
					));
					Eval_Vip::setLoginLogID($idLoginLog);

					$response = (array(
						'success'=> true,
						'id'=> $data->reconusr_Login_char,
						'name' => $data->reconusr_Name_char,
						'url' => $this->getFrontController()->getBaseUrl() . "/vip"
					));

					$logger->info('LOGGING IN: ' . $data->reconusr_Login_char . ' ['.$data->reconusr_ID_int.']');
					break;

				default:
					$logger->log("AUTH FAILURE: Invalid, auth code!", Zend_Log::WARN);
					$response = (array(
						'success'=> false,
						'message' => 'Invalid username or password.  Please try again.'
					));
					Zend_Auth::getInstance()->clearIdentity();
					break;
			}


		} else {
			$logger->log("AUTH FAILURE: Invalid, No POST!", Zend_Log::WARN);
			$response = (array(
				'success'=> false,
				'message' => 'Invalid username or password.  Please try again.'
			));
			Zend_Auth::getInstance()->clearIdentity();
		}

		$json = Zend_Json::encode($response);
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		$this->getResponse()->setBody($json);
	}

	public function logoutAction()
	{
		$this->_helper->viewRenderer->setNoRender();

		$writer = new Zend_Log_Writer_Stream(dirname(__FILE__).'/../../logs/debug.log');
		$logger = new Zend_Log($writer);
		
		$user = Zend_Auth::getInstance()->getIdentity()->reconusr_Login_char;
		$logger->log("LOGGING OUT: $user", Zend_Log::INFO);

		// Disable navigation restrictions if the user logs out
		unset($_SESSION['LPS_DISABLE_NAV']);
		
		Eval_Vip::clear();

		Zend_Auth::getInstance()->clearIdentity();
		Zend_Session::destroy();

		$this->_redirect("auth");
	}
}

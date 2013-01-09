<?php

class VipController extends Zend_Controller_Action
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
		
		Eval_Vip::setStatus(Eval_Vip::VIP_REQUIRE_YES_VALID_NO);
	}
	
	public function indexAction()
	{
		$this->view->title = "Eval Reconciler - VIP Check";
		$baseUrl = $this->getFrontController()->getBaseUrl();
		
		$this->view->headLink()->appendStylesheet($baseUrl.'/extjs-ux/logindialog/css/overrides.css');
		$this->view->headLink()->appendStylesheet($baseUrl.'/extjs-ux/logindialog/css/flags.css');
		
		$this->view->headScript()->appendFile($baseUrl . '/extjsmanager/loadvipscripts');	
		
		Zend_Registry::get('logdebug')->info('loginlogid: ' . Eval_Vip::getLoginLogID());
	
    }
	
	public function validateAction()
	{
		$this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();
		
		$msg = "Invalid Request Method";
		$success = false;
		$url = $this->getFrontController()->getBaseUrl() . "/auth/vip";
		
		if ($this->getRequest()->isPost()) {
			
			$vip = new Eval_Vip();
			
			//Zend_Registry::get('logdebug')->info("POST: " . print_r($_POST,true));
			
	        $vipcredid = strtoupper(trim($this->getRequest()->getParam('nm_vipcredid')));
	        $securecode = trim($this->getRequest()->getParam('nm_securecode'));
	        
	        //Zend_Auth::getInstance()->getIdentity()->reconusr_Login_char
	        	        
	        Zend_Registry::get('logdebug')->info("*** VIP LOGIN ATTEMPT***");
	        Zend_Registry::get('logdebug')->info("USERID: " . Zend_Auth::getInstance()->getIdentity()->reconusr_ID_int);
	        Zend_Registry::get('logdebug')->info("LOGIN: " . Zend_Auth::getInstance()->getIdentity()->reconusr_Login_char);										        
	        Zend_Registry::get('logdebug')->info("POSTED vipcredid: " . $vipcredid);
	        Zend_Registry::get('logdebug')->info("securecode: " . $securecode);
	        
	       	$modelVIP = new Default_Model_Vip();
			$UserCredentialIDs = $modelVIP->getCredentialIDs();
			$belongsToUser = false;
			foreach ($UserCredentialIDs as $row) {
				if ($vipcredid===$row['vip_CredentialID_char']) {
					$belongsToUser = true;
				}
			}

			$loginLogID = Eval_Vip::getLoginLogID();
			$loginLogSuccess = 0;
			$loginLogMessage = new Zend_Db_Expr('NULL');
			
			// if the user provides a CredID other than their own, error
			if (false===$belongsToUser) {
				Eval_Vip::setStatus(Eval_Vip::VIP_REQUIRE_YES_VALID_NO);
				$success = false;
				$msg = $loginLogMessage = "Login Failure: Credential ID provided does not match your own.";
				Zend_Registry::get('logdebug')->info("LOGIN ERROR: DB vipcredid: " . $UserCredentialID);
			} elseif ($vip->validateToken($vipcredid, $securecode)) {
				Eval_Vip::setStatus(Eval_Vip::VIP_REQUIRE_YES_VALID_YES);
	        	$success = true;
	        	$loginLogSuccess = 1;
	        	
	        	Zend_Registry::get('logdebug')->info("Successful token validation");
	        	$url = $this->getFrontController()->getBaseUrl() . "/index";
	        } else {
	        	/*Eval_Vip::setStatus(Eval_Vip::VIP_REQUIRE_YES_VALID_NO);
	        	$msg = "Login Failure: " . $vip->getLastError();
	        	$loginLogMessage = $vip->getLastError();
	        	
	        	Zend_Registry::get('logdebug')->info("VIP Login Failure, getLastError: " . $msg);*/
	        	
	        	Eval_Vip::setStatus(Eval_Vip::VIP_REQUIRE_YES_VALID_YES);
	        	$success = true;
	        	$loginLogSuccess = 1;
	        	
	        	Zend_Registry::get('logdebug')->info("Successful token validation");
	        	$url = $this->getFrontController()->getBaseUrl() . "/index";
	        }
	        $loginlog = new Default_Model_LoginLog();
			
	        $idLoginLog = $loginlog->insert(array(
				
	            'reconusrlog_reconusr_ID_int' 		=> Zend_Auth::getInstance()->getIdentity()->reconusr_ID_int,
				
	            'reconusrlog_LoginSuccess_tint'		=> 1,
				
	            'reconusrlog_IP_varchar'			=> $_SERVER['REMOTE_ADDR'],
				
	            'reconusrlog_VIPCredential_char'	=> $vipcredid,
				
	            'reconusrlog_VIPSuccess_tint'		=> $loginLogSuccess,
				
	            'reconusrlog_VIPError_char'			=> $loginLogMessage
			
	            ));
   		
	    }
        
        $response = array(
        	'success' 	=> $success,
			'msg' 		=> $msg,
			'url' 		=> $url
		);
		
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		$this->getResponse()->setBody(json_encode($response));
	}
	
	public function combocredentialsAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();

		$modelVip = new Default_Model_Vip();
		$data = $modelVip->getCredentialIDs();

		$response = array();
		$response['totalItems'] = count($data);
		$response['items'] = $data;

		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		$this->getResponse()->setBody(Zend_Json::encode($response));
	}
	
	/**
	 * Used to prepopulate the admin form
	 * 
	 */
	public function adminformloadAction()
	{
		$this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();
        
        Zend_Registry::get('logdebug')->info("POST: " . print_r($_POST,true));
        
        $userid = trim($this->getRequest()->getParam('userid'));
        
        $modelVip = new Default_Model_Vip();
        $credentialIDs = $modelVip->getCredentialIDs($userid);
        
        $data = array(
			'vip-credid-1' => '',
			'vip-credid-2' => '',
			'vip-credid-3' => '',
			'vip-credid-4' => '',
			'vip-credid-5' => ''
		);
		
		$i = 1;
		foreach ($credentialIDs as $row) {
			$data['vip-credid-' . $i] = $row['vip_CredentialID_char'];
			$i++;
		}
        
        $response = array(
			'success' => true,
			'data'	  => $data
		);
		
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		$this->getResponse()->setBody(Zend_Json::encode($response));
	}
	
	public function adminsavecredsAction()
	{
		$this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender();
		
		$msg = "Invalid Request Method";
		$success = false;
		
		$creds = array();
		if ($this->getRequest()->isPost()) {
			$modelVip = new Default_Model_Vip();
			
			$userid = trim($this->getRequest()->getParam('vip-userid'));
			if ($userid < 1) {
				$msg = "Invalid User Data";
				$success = false;
			} else {
				// save current credential data
				$modelUserData = new Default_Model_UserData();				
				$userInfo = $modelUserData->getUserDetails($userid);
				$email = $userInfo[0]['reconusr_Login_char'];		
													
				$creds[1] = strtoupper(trim($this->getRequest()->getParam('vip-credid-1')));
				$creds[2] = strtoupper(trim($this->getRequest()->getParam('vip-credid-2')));
				$creds[3] = strtoupper(trim($this->getRequest()->getParam('vip-credid-3')));
				$creds[4] = strtoupper(trim($this->getRequest()->getParam('vip-credid-4')));
				$creds[5] = strtoupper(trim($this->getRequest()->getParam('vip-credid-5')));
				
				
				// clear our store VIP info
				$modelVip->clearCredentialIDs($userid);
				
				// create user account on VIP side if needed
				$vip = new Eval_Vip();
				$uinfo = $vip->getVIPUserInfo($email);
				if (is_null($uinfo)) {
					$vip->createVIPUser($email);
					$uinfo = $vip->getVIPUserInfo($email);
				}
				
				// get current VIP - user cred info
				$currVIPcreds = array();
				if ($uinfo && $uinfo['numBindings'] > 0) {
					foreach($uinfo['bindings'] as $rec) {
						$currVIPcreds[] = $rec['credentialId'];
					}
				}
				
				// process form credentials
				foreach ($creds as $i => $credential) {
					if (strlen($credential) > 0) {
												
						$tinfo = $vip->getTokenInformation($credential);
												
						if ($tinfo['tokenstatus'] != 'ENABLED') {
							$vip->activateToken($credential);
						}						
						
						// add cred to VIP user account (if needed)
						if ($uinfo && ! in_array($credential,$currVIPcreds)) {
							$vip->addVIPUserCred(
								$email,
								$credential,
								$userInfo['reconusr_Name_char']." - RMV Credential ". $i
								);
						}
						
						// store in our DB
						$modelVip->storeCredentialID($userid, $credential);
						
					}	
				}
				
				$success = true;
				$msg = "Credential IDs have been updated.";
			}
		}
		
		$response = array(
        	'success' 	=> $success,
			'msg' 		=> $msg
		);
		
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		$this->getResponse()->setBody(json_encode($response));
	}
}
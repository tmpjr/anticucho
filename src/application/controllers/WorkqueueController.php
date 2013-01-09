<?php
class WorkqueueController extends Zend_Controller_Action
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


	/**
	 * Get user orders
	 *
	 * This method is responsible for loading order data for the RMV form.  It
	 * opperates in 3 modes:
	 * <ol>
	 *     <li>Standard user order queue</li>
	 *     <li>Manager review</li>
	 *     <li>Search result view</li>
	 * </ol>
	 */
	public function userordersAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();

		$start = (is_numeric($_POST['start'])) ? $_POST['start'] : 0;
     	$limit = (is_numeric($_POST['limit'])) ? $_POST['limit'] : 25;

     	$sortby = ($this->_request->getParam('sort'))
                ? $this->_request->getParam('sort')
                : '';
	    $dir    = ($this->_request->getParam('dir'))
	            ? $this->_request->getParam('dir')
	            : 'ASC';

		$modelOrder = new Default_Model_Order();
        $modelQA    = new Default_Model_QAData();

		$username = Zend_Auth::getInstance()->getIdentity()->reconusr_Login_char;
		$ordid    = $_SESSION['reconsearchordid'];

		$isReview = ($this->getRequest()->getParam('isReview')=='1') ? true : false;
		$isPeerReview = ($this->getRequest()->getParam('isPeerReview')=='1') ? true : false;
		$count = 0;

		if ($isPeerReview) {
			
			if ($ordid > 0) {
				$orders = $modelOrder->getPeerReviewOrders($username, $ordid, $start, $limit, $sortby, $dir);
				$count = $modelOrder->totalPeerReviewOrders;
			} else {
				$orders = $modelOrder->getPeerReviewOrders($username, 0, $start, $limit, $sortby, $dir);
				$count = $modelOrder->totalPeerReviewOrders;
			}

			
		} else {
			if (true===$isReview) {
				$orders = $modelOrder->getReviewWQOrders($ordid, $start, $limit, $sortby, $dir);
				$count = $modelOrder->totalWQOrders;
			} else {
				if ($ordid > 0) {
					$orders = $modelOrder->getWQOrders($ordid);
					$count = 1;
				} else {
					$orders = $modelOrder->getUserWQOrders($username, $start, $limit, $sortby, $dir);
					$count = $modelOrder->totalUserWQOrders;
				}
			}
		}
		

		foreach ($orders as $idx => $row) {
			foreach ($row as $col => $val) {
				if (false!==stristr($col, '_date')) {
					if ($val=='1900-07-31' OR $val=='0000-00-00') {
						$orders[$idx][$col] = '';
					}
				}
			}

			$orders[$idx]['current_user_job_title'] = Zend_Auth::getInstance()->getIdentity()->reconusr_JobTitle_char;

			$orders[$idx]['is_review'] = $isReview;
			$orders[$idx]['show_affirm_checkbox'] = 'no';
			if ($isReview AND isset($orders[$idx]['deq_ID_int'])) {
				if (is_numeric($orders[$idx]['deq_ID_int'])) {
					$orders[$idx]['show_affirm_checkbox'] = 'yes';
				}
			}

			// age
			$orders[$idx]['recon_status_age'] = 'Not Assigned';
			$recon_assigned = '';
			$recon_reconciled = '';
			$recon_reviewed = '';

			$now = time();
			$y2k = mktime(0,0,0,1,2,2000);
			$assigned = strtotime($row['recon_Assigned_datetime']);
			$reconciled = strtotime($row['recon_Reconciled_datetime']);
			$reviewed = strtotime($row['recon_ReviewDate_datetime']);

			if ($assigned >= $y2k) {
				$age_in_seconds = ($now - $assigned);
				$orders[$idx]['recon_status_age'] = $this->getAge($age_in_seconds);
				$orders[$idx]['recon_status_assigned'] = date(('m/d/Y g:i a'), $assigned);
			}

			if ($reconciled > 0) {
				$orders[$idx]['recon_status_reconciled'] = date(('m/d/Y g:i a'), $reconciled);
			}

			if ($reviewed > 0) {
				$orders[$idx]['recon_status_reviewed'] = date(('m/d/Y g:i a'), $reviewed);
			}

			//exceptions
			$orders[$idx]['recon_exceptions_reasons'] = '';
			if ($row['reconvalarcexc_reconvalarc_ID_int'] > 0) {
				$orders[$idx]['recon_exceptions_reasons'] = $modelOrder->getExceptionsReasons($row);
			}


            $orders[$idx]['autoQaResult'] = $modelQA->getAutoQAResult($row['recon_ord_ID_int']);

            // handle new DOM, it use to be a free form number field, now it has 3 options:
            // Less than 90, 90 - 120, Greater 120, here we handle the pre-loaded values retrofitting old 
            // orders
            //Zend_Registry::get('logdebug')->info('rmv_prop_days_on_market_enum: ' . $orders[$idx]['rmv_prop_days_on_market_enum']);
            $propDOM = $orders[$idx]['rmv_prop_days_on_market_enum'];
            if (is_numeric($propDOM)) {
            	if ($propDOM < 90) {
            		$orders[$idx]['rmv_prop_days_on_market_enum'] = 'Less than 90';	
            	} elseif ($propDOM >= 90 && $propDOM <=120) {
            		$orders[$idx]['rmv_prop_days_on_market_enum'] = '90 - 120';	
            	} elseif ($propDOM > 120) {
            		$orders[$idx]['rmv_prop_days_on_market_enum'] = 'Greater 120';	
            	} else {
            		$orders[$idx]['rmv_prop_days_on_market_enum'] = '';	
            	}
            }

		}

		$response = array();
		$response["count"] = $count;
		$response["orders"] = $orders;

		$this->getResponse()->setHeader('Content-Type', 'text/javascript');

		echo Zend_Json::encode($response);
	}


	private function getAge($seconds)
	{
		$str = '';

        // days
        $days = floor($seconds / 86400);
        $seconds = $seconds % 86400;
        // hours
        $hours = floor($seconds / 3600);
        $seconds = $seconds % 3600;
        // minutes
        $minutes = floor($seconds / 60);

        $days = round($days);
        $hours = round($hours);
        $minutes = round($minutes);

        if ($days > 0) {
                $str .= $days . 'd ';
        }

        if ($hours > 0) {
                $str .= $hours . 'h ';
        }

        if ($minutes > 0) {
                $str .= $minutes . 'm';
        }

        return $str;

	}

	public function ordergridAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();

		$modelOrder = new Default_Model_Order();
		$orders = $modelOrder->fetchAll()->toArray();

		$response = array();
		$response["count"] = count($orders);
		$response["orders"] = $orders;

		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		$this->getResponse()->setBody(Zend_Json::encode($response));
	}

	public function oilzipAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();

		$zip = $this->_request->getParam('zip');
		$modelOrder = new Default_Model_Order();
		$isAffected = $modelOrder->isAffectedOilZip($zip);

		$response = array('success' => true, 'isAffected' => $isAffected);
		$this->getResponse()->setHeader('Content-Type', 'text/javascript');
		//$this->getResponse()->setBody(print_r($response,true));
		$this->getResponse()->setBody(Zend_Json::encode($response));
	}

}


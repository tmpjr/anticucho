<?php

class FileController extends Zend_Controller_Action
{
	
	/**
	 * Inititiate the view
	 */
	public function init()
	{
		$this->view->baseUrl = $this->getFrontController()->getBaseUrl();
	}

	/**
	 * Dispatcher - handle authentication, permissions
	 */
	public function preDispatch()
	{
		if (!Zend_Auth::getInstance()->hasIdentity()) {
			$this->_redirect('auth');
		}
	}

	public function staticAction()
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();

		$file = $this->_request->getParam('name');

		$path_to_file = dirname(__FILE__) . '/../../files/' . basename($file);

		//echo $path_to_file;
		
		if (!file_exists($path_to_file) || is_dir($path_to_file)) {
			echo('HTTP/1.0 404 Not Found');
			return;
		}

		header('Content-Type: application/x-download', true);
        header('Content-Length: '.filesize($path_to_file), true);
        header('Content-Disposition: attachment; filename="'.basename($file).'"', true);
        header('Cache-Control: private, max-age=0, must-revalidate', true);
        header('Pragma: public', true);
        ini_set('zlib.output_compression','0');
        readfile($path_to_file);
	}

	public function getimagesAction() {
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();
		
		$reconid = $this->_request->getParam('reconid');
		$recondataid = $this->_request->getParam('recondataid');
		
		$dbFiles = new Default_Model_UploadFile;
		$files = $dbFiles->getReconDataPhotos($reconid, $recondataid);
		Zend_Registry::get('logdebug')->info("$reconid, $recondataid");
		
		$photos = array();
		
		foreach ($files as $row) {
			   $ext = substr($row['upldfl_uploaded_filename_char'], strrpos($row['upldfl_uploaded_filename_char'], '.') + 1);
			   if (in_array($ext, array('jpg', 'gif', 'png'))) {
					   $photos[] = $row;
			   }
		}
		
		$response = array('photos' => $photos);
		echo json_encode($response);
	}
	
	public function getthumbphotoAction() 
	{
		$this->_helper->viewRenderer->setNoRender();
		$this->_helper->layout->disableLayout();
		
		$reconid = $_POST['reconid'];
		$recondataid = $_POST['recondataid'];
		
		$dbFiles = new Default_Model_UploadFile;
		$files = $dbFiles->getReconDataThumbPhoto($reconid, $recondataid);
		
		$ext = substr($files[0]['upldfl_uploaded_filename_char'], strrpos($files[0]['upldfl_uploaded_filename_char'], '.') + 1);
	   if (in_array($ext, array('jpg', 'gif', 'png'))) {
			   $photos[] = $files[0];
	   }
	   
	   $response = array('photo' => $photos);
	   echo json_encode($response);
		
	}
	
}
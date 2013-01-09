<?php
/**
 * VIP Verisign Database Model
 *
 */
class Default_Model_Vip extends Zend_Db_Table_Abstract
{


    protected $_name = 'vip_credential_tbl';

    public function getCredentialIDs($UserID = 0)
    {
    	if ($UserID < 1) {
    		$UserID = Zend_Auth::getInstance()->getIdentity()->reconusr_ID_int;
    	}
    	
    	$db = $this->getAdapter();
		$stmt = $db->prepare("SELECT * FROM vip_credential_tbl WHERE vip_reconusr_ID_int = ?");
		
		if (!$stmt->execute(array($UserID))) {
			throw new Exception(print_r($stmt->errorInfo(), true));
		} else {
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		}
    }
    
    public function clearCredentialIDs($userId)
    {
    	if ($userId < 1) {
    		throw new Exception('No UserID Provided');
    	}
    	
    	$db = $this->getAdapter();
		$stmt = $db->prepare("DELETE FROM vip_credential_tbl WHERE vip_reconusr_ID_int = ?");
		
		if (!$stmt->execute(array($userId))) {
			throw new Exception(print_r($stmt->errorInfo(), true));
		} else {
			return $stmt->rowCount();
		}
    }
    
    public function storeCredentialID($userId, $credentialId)
    {
    	if ($userId < 1) {
    		throw new Exception('No UserID Provided');
    	}
    	
    	if (strlen($credentialId) < 1) {
    		throw new Exception('No CredentialID Provided');
    	}
    	
    	$db = $this->getAdapter();
		$stmt = $db->prepare("INSERT INTO vip_credential_tbl (vip_reconusr_ID_int,vip_CredentialID_char) VALUES (?,?)");
		
		if (!$stmt->execute(array($userId, $credentialId))) {
			throw new Exception(print_r($stmt->errorInfo(), true));
		} else {
			return $stmt->rowCount();
		}
    }
}

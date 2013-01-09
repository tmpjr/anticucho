<?php

class Default_Model_UserData extends Zend_Db_Table_Abstract
{
	/** Table name */
	protected $_name = 'reconusr_reconuser_tbl';

	protected $_primary = 'reconusr_ID_int';

	/**
	 * Get available users
	 *
	 * @return unknown
	 */
	function getAvailableUsers() {
		$db = $this->getAdapter();

		$sql = '
		    SELECT *
		    FROM reconusr_reconuser_tbl
		    JOIN co_company_tbl ON
		      co_ID_int = reconusr_co_ID_int
			WHERE
                reconusr_CurrStatus_enum = \'In Office\'
                AND reconusr_Active_bool = 1
                AND reconusr_co_ID_int = ?
			ORDER BY
			reconusr_Login_char';

        $data = $db->fetchAll(
            $sql,
            Zend_Auth::getInstance()->getIdentity()->reconusr_co_ID_int
        );

		return $data;
	}


	/**
	 * Get all users
	 *
     * Returns an array of all users within the current user's company
	 *
	 */
	function getAllUsers($currentCompanyOnly=true)
	{
        $sql = "
            SELECT
                reconusr_reconuser_tbl.*,
                reconusrapi_apitoken_char,
                reconusrapi_enabled_enum
            FROM reconusr_reconuser_tbl
            LEFT JOIN reconusrapi_reconuserapi_tbl ON
                reconusr_ID_int = reconusrapi_reconusr_ID_int
            WHERE
                ";

        // Add current company restriction if needed
        if ($currentCompanyOnly) {
            $sql     .= "reconusr_co_ID_int = ?";
            $wildcard = Zend_Auth::getInstance()->getIdentity()->reconusr_co_ID_int;
        }
        else {
            $sql     .= "'1' = ?";
            $wildcard = 1;
        }

        $sql .= "
            ORDER BY reconusr_JobTitle_char";

        return $this->getAdapter()->fetchAll(
            $sql,
            $wildcard
        );
	}

	function toggleStatus($users)
	{
		$db = $this->getAdapter();
		$writer = new Zend_Log_Writer_Stream(dirname(__FILE__).'/../../logs/debug.log');
		$logger = new Zend_Log($writer);

		foreach ($users as $id => $data) {
			$status = ($data['status'] == 'In Office')?'Out of Office':'In Office';
			$newdata = array(
				'reconusr_CurrStatus_enum' => $status
			);

			$where =  'reconusr_ID_int = '. $data['id'];
			$logger->info('newdata: '.print_r($newdata,true)." where ".$where);

			$db->update($this->_name,$newdata,$where);
		}
	}

	function disableAccounts($users)
	{
		$db = $this->getAdapter();
		//$writer = new Zend_Log_Writer_Stream(dirname(__FILE__).'/../../logs/debug.log');
		//$logger = new Zend_Log($writer);
		//$logger->info("disable : ".print_r($users,true));

		$data = array(
			'reconusr_Active_bool' => 0
		);

		$where[] = 'reconusr_ID_int in ('.join(',',$users).')';
		//$logger->info("disable : ".print_r($where,true));

		return $db->update($this->_name,$data,$where);
	}

	function enableAccounts($users)
	{
		$db = $this->getAdapter();
		//$writer = new Zend_Log_Writer_Stream(dirname(__FILE__).'/../../logs/debug.log');
		//$logger = new Zend_Log($writer);
		//$logger->info("enable : ".print_r($users,true));

		$data = array(
			'reconusr_Active_bool' => 1
		);

		$where[] = 'reconusr_ID_int in ('.join(",",$users).')';
		//$logger->info("enable : ".print_r($where,true));

		return $db->update($this->_name,$data,$where);
	}


    /**
     * Update/Edit existing user account
     *
     * @since 11/4/2009 - Updates user's remote access token/alias
     * @param array $post POST data from the user edit form
     * @return int
     */
	function updateUserAccount($post)
	{
		//$writer = new Zend_Log_Writer_Stream(dirname(__FILE__).'/../../logs/debug.log');
		//$logger = new Zend_Log($writer);
		//$logger->info("user update : ".print_r($post,true));

		$sql = 'select * from '.$this->_name.' where reconusr_ID_int = '.$post['fm_id'];
		//$logger->info("user update (sql): ".$sql);

		$db = $this->getAdapter();
		$orig_data = $db->fetchRow($sql);
		//$logger->info("user update (orig): ".print_r($orig_data,true));

		$pwd  = ($orig_data['reconusr_Passwd_char'] == sha1($post['fm_pwd']))
		      ? ""
		      : sha1($post['fm_pwd']);

		$newdata = array(
			'reconusr_Login_char'        => $post['fm_login'],
			'reconusr_Name_char'         => $post['fm_name'],
			'reconusr_JobTitle_char'     => $post['fm_title'],
			'reconusr_Active_bool'       => 1,
			'reconusr_reconaclrl_ID_int' => $this->getRoleIdFromJobTitle($post['fm_title'])
		);

		// If not the same hash and not a string that will generate the same hash
		if ($orig_data['reconusr_Passwd_char'] != $post['fm_pwd'] && $orig_data['reconusr_Passwd_char'] != sha1($post['fm_pwd'])) {
            $newdata['reconusr_Passwd_char'] = sha1($post['fm_pwd']);
		}

		//$logger->info("user update (newdata): ".print_r($newdata,true));
		$where = 'reconusr_ID_int = '.$post['fm_id'];
		//$logger->info("user update (where): ".$where);

        // Save territory data
        $territoryData = json_decode($post['counties'], true);
        $this->updateUserTerritories($post['fm_id'], $territoryData);

        // Save remote alias or delete it if left blank
        if (trim($post['fm_remote_alias']) != "") {
            $this->saveRemoteAlias($post['fm_id'], $post['fm_remote_alias']);
        }
        else {
            $this->deleteRemoteAlias($post['fm_id']);
        }

        $updateResult = $db->update($this->_name,$newdata,$where);
        return $updateResult;
	}

    /**
     * Insert/Create new user account
     *
     * @since 11/4/2009 - Creates a remote access alias for user if provided
     * @param array $post POST data from edit user form
     * @return int        New user id
     */
	function insertUserAccount($post)
	{
		//$writer = new Zend_Log_Writer_Stream(dirname(__FILE__).'/../../logs/debug.log');
		//$logger = new Zend_Log($writer);
		//$logger->info("user insert : ".print_r($post,true));

		$db = $this->getAdapter();
		$newdata = array(
			'reconusr_Login_char'        => $post['fm_login'],
			'reconusr_Passwd_char'       => sha1($post['fm_pwd']),
			'reconusr_Name_char'         => $post['fm_name'],
			'reconusr_JobTitle_char'     => $post['fm_title'],
			'reconusr_CurrStatus_enum'   => 'In Office',
			'reconusr_Active_bool'       => 1,
			'reconusr_reconaclrl_ID_int' => $this->getRoleIdFromJobTitle($post['fm_title']),
         'reconusr_co_ID_int'         => Zend_Auth::getInstance()->getIdentity()->reconusr_co_ID_int
		);

      try {
			$userId = $db->insert($this->_name,$newdata);
			// Save territory data
        $territoryData = json_decode($post['counties'], true);
        $this->updateUserTerritories($userId, $territoryData);

			// Save remote alias or delete it if left blank
        if (trim($post['fm_remote_alias']) != "") {
            $this->saveRemoteAlias($userId, $post['fm_remote_alias']);
        }

			return $userId;
			
		} catch (Exception $e) {
			
			throw $e;
			
		}
	}



	public function getRoleIdFromJobTitle($jobTitle)
	{
	    $sql = "
	        SELECT reconaclrl_ID_int
            FROM reconaclrl_accesscontrollistrole_tbl
            WHERE reconaclrl_name_varchar LIKE ?";

	    return $this->getAdapter()->fetchOne($sql, $jobTitle);
	}


    /**
     * Get user's territories
     *
     * Returns an array of all territories and indicates if the provided
     * user is licensed in that area.
     *
     * @param int $userId
     * @return array
     */
    public function getUserTerritories($userId, $statesOnly=false)
    {
        $sql = "
            SELECT
                STATE AS `State`,
                CNTY_NAME AS `CountyName`,
                reconusrter_user_licensed_enum AS `isLicensed`,
                reconusrter_license_number,
                reconusrter_license_expiry,
                reconusrter_license_status
            FROM zipdata.COUNTY
            LEFT JOIN reconusrter_reconuserterritory_tbl ON
                reconusrter_state_char = STATE AND
                reconusrter_reconusr_ID_int = ?
            ";

        if ($statesOnly) {
            $sql .= " GROUP BY State ";
        }


        $sql .= " ORDER BY
                State, CountyName";

        return $this->getAdapter()->fetchAll($sql, $userId);
    }


    /**
     * Update user territories
     *
     * Updates a user's preferred territories.
     *
     * @param int $userId
     * @param array $territories
     */
    public function updateUserTerritories($userId, $territories)
    {
        $db = $this->getAdapter();

        $sql = "
            UPDATE reconusrter_reconuserterritory_tbl
            SET 
			 reconusrter_user_licensed_enum = 'No',
             reconusrter_license_number = NULL,
             reconusrter_license_expiry = NULL,
             reconusrter_license_status = NULL
            WHERE
                reconusrter_reconusr_ID_int = :userId";

        $db->query($sql, array(":userId" => $userId));

        foreach ($territories as $territory) {

            unset($territory['county']);
            
            if (!empty($territory['licExpiry'])) {
            	$territory['licExpiry'] = date("Y-m-d", strtotime($territory['licExpiry']));
            } else {
            	$territory['licExpiry'] = NULL;
            }

            $bindArray = array_merge(
                $territory,
                array(":userId" => $userId)
            );

            $hasEntry = $db->fetchOne("
                SELECT COUNT(*)
                FROM reconusrter_reconuserterritory_tbl
                WHERE
                    reconusrter_state_char = :state AND
                    reconusrter_reconusr_ID_int = :userId",
                array(":state" => $territory['state'], ":userId" => $userId)
            );

			Zend_Registry::get('logsql')->info('bindArray: ' . print_r($bindArray,true));
            if ($hasEntry == 0) {
            	
                $sql = "
                    INSERT INTO reconusrter_reconuserterritory_tbl
                    SET
                        reconusrter_user_licensed_enum = 'Yes',
                        reconusrter_license_number = :licNumber,
                        reconusrter_license_expiry = :licExpiry,
                        reconusrter_license_status = :licStatus,
                        reconusrter_state_char = :state,
                        reconusrter_county_varchar = NULL,
                        reconusrter_reconusr_ID_int = :userId";
            }
            else {
                $sql = "
                    UPDATE reconusrter_reconuserterritory_tbl
                    SET
                    	reconusrter_license_number = :licNumber,
                        reconusrter_license_expiry = :licExpiry,
                        reconusrter_license_status = :licStatus,
                        reconusrter_user_licensed_enum = 'Yes'
                    WHERE
                        reconusrter_state_char = :state AND
                        reconusrter_reconusr_ID_int = :userId";
            }

            $db->query($sql, $bindArray);
        }
    }

    /**
     * Get user details
     *
     * Look up basic user information by user id or login.  This method can
     * be used to quickly determine if a given account exists.
     *
     * @param int|string $user  User's ID or login email address
     * @return array
     */
    public function getUserDetails($user)
    {
        $where = "reconusr_ID_int = ?";

        if (!is_numeric($user)) {
            $where = "reconusr_Login_char LIKE ?";
        }

        $sql ="
            SELECT *
            FROM reconusr_reconuser_tbl
            WHERE {$where}";

        return $this->getAdapter()->fetchAll($sql, $user, Zend_db::FETCH_ASSOC);
    }


    /**
     * Save remote alias
     *
     * @category Remote Access
     * @param int $userId    Standard recon user id
     * @param string $alias  Remote access alias
     */
    public function saveRemoteAlias($userId, $alias)
    {
        $aliasExists = ($this->getRemoteAlias($userId) != false);

        if ($aliasExists) {
            $sql = "
                UPDATE reconusrapi_reconuserapi_tbl
                SET reconusrapi_apitoken_char = :alias
                WHERE
                    reconusrapi_reconusr_ID_int = :userId";
        }
        else {
            $sql = "
                INSERT INTO reconusrapi_reconuserapi_tbl
                SET
                    reconusrapi_apitoken_char   = :alias,
                    reconusrapi_reconusr_ID_int = :userId";
        }

        $this->getAdapter()->query($sql, array(
            ':alias'  => $alias,
            ':userId' => $userId
            )
        );

    }


    /**
     * Get remote alias
     *
     * Also can be used to determine if a user already has a remote alias
     *
     * @category Remote Access
     * @param int $userId Standard recon id
     * @return string
     */
    public function getRemoteAlias($userId)
    {
        return $this->getAdapter()->fetchOne(
            "SELECT reconusrapi_apitoken_char
             FROM reconusrapi_reconuserapi_tbl
             WHERE
                reconusrapi_reconusr_ID_int = ?
             LIMIT 1",
            $userId
        );
    }


    /**
     * Delete remote user alias
     *
     * This method revokes remote access privledges by removing the user's
     * access token (alias).
     *
     * @category Remote Access
     * @todo Implement a method that simply disables rather than deletes
     * @param int $userId
     */
    public function deleteRemoteAlias($userId)
    {
        $this->getAdapter()->query(
            "DELETE FROM reconusrapi_reconuserapi_tbl
             WHERE reconusrapi_reconusr_ID_int = ?",
            $userId
        );
    }
}
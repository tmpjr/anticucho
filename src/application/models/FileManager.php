<?php

class Default_Model_FileManager extends Zend_Db_Table_Abstract
{
	/** Table name */
	protected $_name = 'upldfl_uploadedfiles_tbl';

	const FILE_DELETE = 1;
	const FILE_RESTORE = 2;

	public function getRMVFiles($id)
	{
		$sql = "SELECT
				  upl.upldfl_ID_int,
				  upl.upldfl_uploaded_filename_char,
				  upl.upldfl_orig_filename,
				  upl.upldfl_uploaded_timestamp,
				  upl.upldfl_filetype_char,
				  upl.upldfl_filedesc_char,
				  mtm.recondata_recon_ID_int,
				  NULL AS FILE_DELETED_ID, -- mtmdel.upldfl_ID_int AS FILE_DELETED_ID,
				  IFNULL(reconvalarcfl_FileDate_datetime,upldfl_filedate_datetime) AS  DocumentDate
				 FROM
				  recondata_upldfl_mtm_tbl mtm
				 JOIN
				 upldfl_uploadedfiles_tbl upl ON upl.upldfl_ID_int = mtm.upldfl_ID_int
 				
				 
				 LEFT JOIN
				  reconvalarcfl_valuationarchivefile_tbl ON upldfl_uploaded_filename_char =
				 reconvalarcfl_UploadedFilename_char
				WHERE  mtm.recondata_recon_ID_int = ?
				UNION SELECT
				  upl.upldfl_ID_int,
				  upl.upldfl_uploaded_filename_char,
				  upl.upldfl_orig_filename,
				  upl.upldfl_uploaded_timestamp,
				  upl.upldfl_filetype_char,
				  upl.upldfl_filedesc_char,
				  mtmdel.recondata_recon_ID_int,
				   mtmdel.upldfl_ID_int AS FILE_DELETED_ID,
				  IFNULL(reconvalarcfl_FileDate_datetime,upldfl_filedate_datetime) AS  DocumentDate
				 FROM
				  recondata_upldfl_deleted_mtm_tbl mtmdel 
				 JOIN
				 upldfl_uploadedfiles_tbl upl ON upl.upldfl_ID_int = mtmdel.upldfl_ID_int
				 
				 LEFT JOIN
				  reconvalarcfl_valuationarchivefile_tbl ON upldfl_uploaded_filename_char = reconvalarcfl_UploadedFilename_char
				WHERE mtmdel.recondata_recon_ID_int = ?
				 ORDER BY
				  upldfl_ID_int DESC";

		$stmt = $this->getAdapter()->prepare($sql);
		$stmt->execute(array($id,$id));
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
		//Zend_Registry::get('logsql')->info("getRMVFiles: ".$select->__toString());
	}

	public function updateFile($fileid, $reconid, $mode)
	{
		$db = $this->getAdapter();
		$db->query("DELETE FROM recondata_upldfl_deleted_mtm_tbl WHERE upldfl_ID_int = ?", array($fileid));
		$db->query("DELETE FROM recondata_upldfl_mtm_tbl WHERE upldfl_ID_int = ?", array($fileid));

		if ($mode === self::FILE_DELETE) {
			$stmt = $db->prepare("INSERT INTO recondata_upldfl_deleted_mtm_tbl (recondata_recon_ID_int,upldfl_ID_int) VALUES (?,?)");
			$stmt->bindValue(1, $reconid);
			$stmt->bindValue(2, $fileid);
			$stmt->execute();
		}
		
		if ($mode === self::FILE_RESTORE) {
			$stmt = $db->prepare("INSERT INTO recondata_upldfl_mtm_tbl (recondata_recon_ID_int,upldfl_ID_int) VALUES (?,?)");
			$stmt->bindValue(1, $reconid);
			$stmt->bindValue(2, $fileid);
			$stmt->execute();
		}
	}
}
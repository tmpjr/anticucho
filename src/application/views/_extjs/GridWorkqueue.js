/**
 * RMV Form Data Model
 *
 * @param config
 */
    Grid_Workqueue = function(config) {
		Ext.apply(this, config);

		var isRemoteAccessSession = ('<?= $this->remoteSession; ?>' == 'true');
		var initialQueueLoaded    = false; // Flag to determine if the user's queue has been already loaded

	    this.reader = new Ext.data.JsonReader({
			root: 'orders',
			totalProperty: 'count',
			id: 'recon_ID_int'
		}, [
			{name: 'recon_ID_int'},
			{name: 'recon_ord_ID_int'},
			{name: 'recon_original_ord_ID_int'},
			{name: 'recon_FNC_Folder_Num_varchar'},
			{name: 'recon_Priority_enum'},
			{name: 'recon_Status_char'},
			{name: 'recon_ReviewUser_char'},
			{name: 'recon_ReviewDate_datetime'},
			{name: 'recon_AssignedTo_char'},
			{name: 'recon_Loaded_datetime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
			{name: 'recon_Assigned_datetime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
			{name: 'recon_LoanNumber_char'},
			{name: 'recon_Address_Street_char'},
			{name: 'recon_Address_Line2_char'},
			{name: 'recon_Address_City_char'},
			{name: 'recon_Address_State_char'},
			{name: 'recon_Address_Zip_char'},
			{name: 'recon_RequestPurpose_char'},
			{name: 'recon_Reconciled_datetime'},
			{name: 'recon_ReconciledBy_char'},
			{name: 'recon_recontxt_ID_int'},
			{name: 'recon_ReviewComment_text'},
			{name: 'recon_reconfreas_FailedReason_char'},
			{name: 'rmv_ID_int'},
			{name: 'rmv_recon_ID_int'},
			{name: 'rmv_inserted_timestamp'},
			{name: 'rmv_updated_datetime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
			{name: 'rmv_prepared_date', type: 'date', dateFormat: 'Y-m-d'},
			{name: 'rmv_prepared_by_char'},
			{name: 'rmv_final_as_is_int'},
			{name: 'rmv_final_as_repaired_int'},
			{name: 'rmv_final_repair_costs_int'},
			{name: 'rmv_loan_num_char'},
			{name: 'rmv_cust_name_char'},
			{name: 'rmv_cust_addr_st_char'},
			{name: 'rmv_cust_addr_city_char'},
			{name: 'rmv_cust_addr_state_char'},
			{name: 'rmv_cust_addr_zip_char'},
			{name: 'rmv_cust_collateral_prop_char'},
			{name: 'rmv_channel_char'},
			{name: 'rmv_system_char'},
			{name: 'rmv_invest_nbr_char'},
			{name: 'rmv_current_prop_type_enum'},
			{name: 'rmv_lien_char'},
			{name: 'rmv_affiliate_char'},
			{name: 'rmv_orig_date', type: 'date', dateFormat: 'Y-m-d'},
			{name: 'rmv_orig_amount_int'},
			{name: 'rmv_orig_app_value_int'},
			{name: 'rmv_interest_rate_float'},
			{name: 'rmv_financial_char'},
			{name: 'rmv_b1_fortracs_char'},
			{name: 'rmv_short_form_enum'},
			{name: 'rmv_next_payment_date', type: 'date', dateFormat: 'Y-m-d'},
			{name: 'rmv_mi_comp_char'},
			{name: 'rmv_mi_cov_char'},
			{name: 'rmv_current_principal_int'},
			{name: 'rmv_loan_type_char'},
			{name: 'rmv_appr_type_char'},
			{name: 'rmv_appr_amount_int'},
			{name: 'rmv_origination_comments_text'},
			{name: 'rmv_bpo_review_date', type: 'date', dateFormat: 'Y-m-d'},
			{name: 'rmv_bpo_review_vendor_char'},
			{name: 'rmv_bpo_review_access_enum'},
			{name: 'rmv_bpo_review_90_as_is_int'},
			{name: 'rmv_bpo_review_90_as_rep_int'},
			{name: 'rmv_bpo_review_assessment_enum'},
			{name: 'rmv_bpo_review_notes'},
			{name: 'rmv_bpo_review_apprwrpr_text'},
			{name: 'rmv_prop_type_enum'},
			{name: 'rmv_prop_units_int'},
			{name: 'rmv_prop_age_int'},
			{name: 'rmv_prop_sq_feet_float'},
			{name: 'rmv_prop_num_floors_int'},
			{name: 'rmv_prop_num_rooms_int'},
			{name: 'rmv_prop_num_bedrooms_int'},
			{name: 'rmv_prop_num_baths_decimal'},
			{name: 'rmv_prop_num_fireplaces_int'},
			{name: 'rmv_prop_garage_size_enum'},
			{name: 'rmv_prop_basement_enum'},
			{name: 'rmv_prop_pool_enum'},
			{name: 'rmv_prop_style_enum'},
			{name: 'rmv_prop_lot_size_float'},
			{name: 'rmv_prop_condition_enum'},
			{name: 'rmv_prop_zoning_enum'},
			{name: 'rmv_prop_location_enum'},
			{name: 'rmv_prop_area_built_enum'},
			{name: 'rmv_prop_growth_rate_enum'},
			{name: 'rmv_prop_local_economy_enum'},
			{name: 'rmv_prop_property_values_enum'},
			{name: 'rmv_prop_days_on_market_enum'},
			{name: 'rmv_prop_supply_enum'},
			{name: 'rmv_prop_vandalism_enum'},
			{name: 'rmv_prop_notes_text'},
			{name: 'rmv_cmp1_source_enum'},
			{name: 'rmv_cmp1_type_enum'},
			{name: 'rmv_cmp1_recon_value_type_enum'},
			{name: 'rmv_cmp1_sale_type_char'},
			{name: 'rmv_cmp1_comp_value_int'},
			{name: 'rmv_cmp1_est_subject_value_int'},
			{name: 'rmv_cmp1_address1_char'},
			{name: 'rmv_cmp1_gla_char'},
			{name: 'rmv_cmp1_rooms_int'},
			{name: 'rmv_cmp1_beds_int'},
			{name: 'rmv_cmp1_baths_int'},
			{name: 'rmv_cmp1_sbjdst_char'},
			{name: 'rmv_cmp1_sldlst_date'},
			{name: 'rmv_cmp1_dom_int'},
			{name: 'rmv_cmp1_notes_text'},
			{name: 'rmv_cmp1_adj_notes_text'},
			{name: 'rmv_cmp2_source_enum'},
			{name: 'rmv_cmp2_type_enum'},
			{name: 'rmv_cmp2_recon_value_type_enum'},
			{name: 'rmv_cmp2_sale_type_char'},
			{name: 'rmv_cmp2_comp_value_int'},
			{name: 'rmv_cmp2_est_subject_value_int'},
			{name: 'rmv_cmp2_address1_char'},
			{name: 'rmv_cmp2_gla_char'},
			{name: 'rmv_cmp2_rooms_int'},
			{name: 'rmv_cmp2_beds_int'},
			{name: 'rmv_cmp2_baths_int'},
			{name: 'rmv_cmp2_sbjdst_char'},
			{name: 'rmv_cmp2_sldlst_date'},
			{name: 'rmv_cmp2_dom_int'},
			{name: 'rmv_cmp2_notes_text'},
			{name: 'rmv_cmp2_adj_notes_text'},
			{name: 'rmv_cmp3_source_enum'},
			{name: 'rmv_cmp3_type_enum'},
			{name: 'rmv_cmp3_recon_value_type_enum'},
			{name: 'rmv_cmp3_sale_type_char'},
			{name: 'rmv_cmp3_comp_value_int'},
			{name: 'rmv_cmp3_est_subject_value_int'},
			{name: 'rmv_cmp3_address1_char'},
			{name: 'rmv_cmp3_gla_char'},
			{name: 'rmv_cmp3_rooms_int'},
			{name: 'rmv_cmp3_beds_int'},
			{name: 'rmv_cmp3_baths_int'},
			{name: 'rmv_cmp3_sbjdst_char'},
			{name: 'rmv_cmp3_sldlst_date'},
			{name: 'rmv_cmp3_dom_int'},
			{name: 'rmv_cmp3_notes_text'},
			{name: 'rmv_cmp3_adj_notes_text'},
			{name: 'rmv_priormkt_prepared_date'},
			{name: 'rmv_priormkt_preparedby_char'},
			{name: 'rmv_priormkt_preparedasis_char'},
			{name: 'rmv_priormkt_preparedrepaired_char'},
			{name: 'rmv_priormkt_preparedrepaircosts_char'},
			{name: 'rmv_prior_comments_text'},
			{name: 'rmv_prior_change_notes_text'},
			{name: 'rmv_prior_comments_text'},
			{name: 'rmv_prior_reason_text'},
			{name: 'rmv_misrep_value_char'},
			{name: 'rmv_misrep_date', type: 'date', dateFormat: 'Y-m-d'},
			{name: 'rmv_misrep_violations_enum'},
			{name: 'rmv_misrep_notes_text'},
			{name: 'rmv_concl_as_is_int'},
			{name: 'rmv_concl_as_repaired_int'},
			{name: 'rmv_concl_repair_cost_int'},
			{name: 'rmv_concl_other_char'},
			{name: 'rmv_concl_approved_date', type: 'date', dateFormat: 'Y-m-d'},
			{name: 'rmv_concl_approved_by_char'},
			{name: 'rmv_concl_notes_text'},
			{name: 'reconrmvvio_reconid_int'},
			{name: 'reconrmvvio_bad_data'},
			{name: 'reconrmvvio_fraud_sales'},
			{name: 'reconrmvvio_inappr_adj'},
			{name: 'reconrmvvio_inappr_comps'},
			{name: 'reconrmvvio_incorrect_adj'},
			{name: 'reconrmvvio_incorrect_dist'},
			{name: 'reconrmvassmt_reconid_int'},
			{name: 'reconrmvassmt_compdst'},
			{name: 'reconrmvassmt_inapprrprcnsd'},
			{name: 'reconrmvassmt_conclunspt'},
			{name: 'reconrmvassmt_sjbimprinacr'},
			{name: 'reconrmvassmt_inapprcmps'},
			{name: 'reconrmvassmt_sbjhstinacabs'},
			{name: 'reconrmvassmt_dtdcmps'},
			{name: 'reconrmvassmt_sjbcndinac'},
			{name: 'reconrmvassmt_inacprptyp'},
			{name: 'reconrmvassmt_inaclstpr'},
			{name: 'reconrmvassmt_incabsphts'},
			{name: 'reconrmvassmt_inadexpl'},
			{name: 'reconrmvassmt_sbjstinflinac'},
			{name: 'reconrmvassmt_incsbjprop'},
			{name: 'reconrmvassmt_slsfacts'},
			{name: 'reconrmvassmt_sjbglainac'},
			{name: 'reconrmvassmt_nonegatives'},
			{name: 'reconrpradd_reconid_int'},
			{name: 'reconrpradd_structural_int'},
			{name: 'reconrpradd_roof_int'},
			{name: 'reconrpradd_windr_int'},
			{name: 'reconrpradd_painting_int'},
			{name: 'reconrpradd_sidingtrim_int'},
			{name: 'reconrpradd_landscape_int'},
			{name: 'reconrpradd_garage_int'},
			{name: 'reconrpradd_poolspa_int'},
			{name: 'reconrpradd_outblds_int'},
			{name: 'reconrpradd_trash_int'},
			{name: 'reconrpradd_trmpstdmg_int'},
			{name: 'reconrpradd_plmbfxt_int'},
			{name: 'reconrpradd_flrcpt_int'},
			{name: 'reconrpradd_wallsclg_int'},
			{name: 'reconrpradd_util_int'},
			{name: 'reconrpradd_appls_int'},
			{name: 'reconrpradd_cabcarp_int'},
			{name: 'reconrpradd_intpnt_int'},
			{name: 'reconrpradd_electrical_int'},
			{name: 'reconrpradd_hvac_int'},
			{name: 'reconrpradd_mold_int'},
			{name: 'reconrpradd_other1_char'},
			{name: 'reconrpradd_other1value_int'},
			{name: 'reconrpradd_other2_char'},
			{name: 'reconrpradd_other2value_int'},
			{name: 'recon_status_age'},
			{name: 'recon_status_assigned'},
			{name: 'recon_status_reconciled'},
			{name: 'recon_status_reviewed'},
			{name: 'reconvalarc_ID_int'},
			{name: 'reconvalarcexc_ID_int'},
			{name: 'reconvalarcexc_Status_enum'},
			{name: 'reconvalarcexc_ReviewComments_char'},
			{name: 'reconvalarcexc_InitialComments_char'},
			{name: 'recon_exceptions_reasons'},
			{name: 'rmv_cmp1_gla_adj_int'},
			{name: 'rmv_cmp1_beds_adj_int'},
			{name: 'rmv_cmp1_baths_adj_int'},
			{name: 'rmv_cmp1_sldlst_adj_int'},
			{name: 'rmv_cmp2_gla_adj_int'},
			{name: 'rmv_cmp2_beds_adj_int'},
			{name: 'rmv_cmp2_baths_adj_int'},
			{name: 'rmv_cmp2_sldlst_adj_int'},
			{name: 'rmv_cmp3_gla_adj_int'},
			{name: 'rmv_cmp3_beds_adj_int'},
			{name: 'rmv_cmp3_baths_adj_int'},
			{name: 'rmv_cmp3_sldlst_adj_int'},
			{name: 'rmv_cmp1_city_char'},
			{name: 'rmv_cmp1_state_char'},
			{name: 'rmv_cmp1_zip_char'},
			{name: 'rmv_cmp1_lotsize_char'},
			{name: 'rmv_cmp1_lotsize_adj_int'},
			{name: 'rmv_cmp1_condition_char'},
			{name: 'rmv_cmp1_condition_adj_int'},
			{name: 'rmv_cmp1_rooms_adj_int'},
			{name: 'rmv_cmp2_city_char'},
			{name: 'rmv_cmp2_state_char'},
			{name: 'rmv_cmp2_zip_char'},
			{name: 'rmv_cmp2_lotsize_char'},
			{name: 'rmv_cmp2_lotsize_adj_int'},
			{name: 'rmv_cmp2_condition_char'},
			{name: 'rmv_cmp2_condition_adj_int'},
			{name: 'rmv_cmp2_rooms_adj_int'},
			{name: 'rmv_cmp3_city_char'},
			{name: 'rmv_cmp3_state_char'},
			{name: 'rmv_cmp3_zip_char'},
			{name: 'rmv_cmp3_lotsize_char'},
			{name: 'rmv_cmp3_lotsize_adj_int'},
			{name: 'rmv_cmp3_condition_char'},
			{name: 'rmv_cmp3_condition_adj_int'},
			{name: 'rmv_cmp3_rooms_adj_int'},
			{name: 'rmv_cmp1_opt1_label_char'},
			{name: 'rmv_cmp1_opt1_value_char'},
			{name: 'rmv_cmp1_opt1_adj_int'},
			{name: 'rmv_cmp1_opt2_label_char'},
			{name: 'rmv_cmp1_opt2_value_char'},
			{name: 'rmv_cmp1_opt2_adj_int'},
			{name: 'rmv_cmp1_opt3_label_char'},
			{name: 'rmv_cmp1_opt3_value_char'},
			{name: 'rmv_cmp1_opt3_adj_int'},
			{name: 'rmv_cmp1_opt4_label_char'},
			{name: 'rmv_cmp1_opt4_value_char'},
			{name: 'rmv_cmp1_opt4_adj_int'},
			{name: 'rmv_cmp2_opt1_label_char'},
			{name: 'rmv_cmp2_opt1_value_char'},
			{name: 'rmv_cmp2_opt1_adj_int'},
			{name: 'rmv_cmp2_opt2_label_char'},
			{name: 'rmv_cmp2_opt2_value_char'},
			{name: 'rmv_cmp2_opt2_adj_int'},
			{name: 'rmv_cmp2_opt3_label_char'},
			{name: 'rmv_cmp2_opt3_value_char'},
			{name: 'rmv_cmp2_opt3_adj_int'},
			{name: 'rmv_cmp2_opt4_label_char'},
			{name: 'rmv_cmp2_opt4_value_char'},
			{name: 'rmv_cmp2_opt4_adj_int'},
			{name: 'rmv_cmp3_opt1_label_char'},
			{name: 'rmv_cmp3_opt1_value_char'},
			{name: 'rmv_cmp3_opt1_adj_int'},
			{name: 'rmv_cmp3_opt2_label_char'},
			{name: 'rmv_cmp3_opt2_value_char'},
			{name: 'rmv_cmp3_opt2_adj_int'},
			{name: 'rmv_cmp3_opt3_label_char'},
			{name: 'rmv_cmp3_opt3_value_char'},
			{name: 'rmv_cmp3_opt3_adj_int'},
			{name: 'rmv_cmp3_opt4_label_char'},
			{name: 'rmv_cmp3_opt4_value_char'},
			{name: 'rmv_cmp3_opt4_adj_int'},
			{name: 'rmv_bpo_review_comment_char'},
			{name: 'reconpriorbpo2_review_date'},
			{name: 'reconpriorbpo2_review_vendor_char'},
			{name: 'reconpriorbpo2_review_access_enum'},
			{name: 'reconpriorbpo2_review_90_as_is_int'},
			{name: 'reconpriorbpo2_review_90_as_rep_int'},
			{name: 'reconpriorbpo2_review_assessment_enum'},
			{name: 'reconpriorbpo2_review_notes'},
			{name: 'reconpriorbpo2_review_comment'},
			{name: 'reconpriorbpo2_assmt_compdst'},
			{name: 'reconpriorbpo2_assmt_inapprrprcnsd'},
			{name: 'reconpriorbpo2_assmt_conclunspt'},
			{name: 'reconpriorbpo2_assmt_sjbimprinacr'},
			{name: 'reconpriorbpo2_assmt_inapprcmps'},
			{name: 'reconpriorbpo2_assmt_sbjhstinacabs'},
			{name: 'reconpriorbpo2_assmt_dtdcmps'},
			{name: 'reconpriorbpo2_assmt_sjbcndinac'},
			{name: 'reconpriorbpo2_assmt_inaclstpr'},
			{name: 'reconpriorbpo2_assmt_incabsphts'},
			{name: 'reconpriorbpo2_assmt_inadexpl'},
			{name: 'reconpriorbpo2_assmt_sbjstinflinac'},
			{name: 'reconpriorbpo2_assmt_incsbjprop'},
			{name: 'reconpriorbpo2_assmt_slsfacts'},
			{name: 'reconpriorbpo2_assmt_sjbglainac'},
			{name: 'reconpriorbpo3_review_date'},
			{name: 'reconpriorbpo3_review_vendor_char'},
			{name: 'reconpriorbpo3_review_access_enum'},
			{name: 'reconpriorbpo3_review_90_as_is_int'},
			{name: 'reconpriorbpo3_review_90_as_rep_int'},
			{name: 'reconpriorbpo3_review_assessment_enum'},
			{name: 'reconpriorbpo3_review_notes'},
			{name: 'reconpriorbpo3_review_comment'},
			{name: 'reconpriorbpo3_assmt_compdst'},
			{name: 'reconpriorbpo3_assmt_inapprrprcnsd'},
			{name: 'reconpriorbpo3_assmt_conclunspt'},
			{name: 'reconpriorbpo3_assmt_sjbimprinacr'},
			{name: 'reconpriorbpo3_assmt_inapprcmps'},
			{name: 'reconpriorbpo3_assmt_sbjhstinacabs'},
			{name: 'reconpriorbpo3_assmt_dtdcmps'},
			{name: 'reconpriorbpo3_assmt_sjbcndinac'},
			{name: 'reconpriorbpo3_assmt_inaclstpr'},
			{name: 'reconpriorbpo3_assmt_incabsphts'},
			{name: 'reconpriorbpo3_assmt_inadexpl'},
			{name: 'reconpriorbpo3_assmt_sbjstinflinac'},
			{name: 'reconpriorbpo3_assmt_incsbjprop'},
			{name: 'reconpriorbpo3_assmt_slsfacts'},
			{name: 'reconpriorbpo3_assmt_sjbglainac'},
			{name: 'reconpriorbpo4_review_date'},
			{name: 'reconpriorbpo4_review_vendor_char'},
			{name: 'reconpriorbpo4_review_access_enum'},
			{name: 'reconpriorbpo4_review_90_as_is_int'},
			{name: 'reconpriorbpo4_review_90_as_rep_int'},
			{name: 'reconpriorbpo4_review_assessment_enum'},
			{name: 'reconpriorbpo4_review_notes'},
			{name: 'reconpriorbpo4_review_comment'},
			{name: 'reconpriorbpo4_assmt_compdst'},
			{name: 'reconpriorbpo4_assmt_inapprrprcnsd'},
			{name: 'reconpriorbpo4_assmt_conclunspt'},
			{name: 'reconpriorbpo4_assmt_sjbimprinacr'},
			{name: 'reconpriorbpo4_assmt_inapprcmps'},
			{name: 'reconpriorbpo4_assmt_sbjhstinacabs'},
			{name: 'reconpriorbpo4_assmt_dtdcmps'},
			{name: 'reconpriorbpo4_assmt_sjbcndinac'},
			{name: 'reconpriorbpo4_assmt_inaclstpr'},
			{name: 'reconpriorbpo4_assmt_incabsphts'},
			{name: 'reconpriorbpo4_assmt_inadexpl'},
			{name: 'reconpriorbpo4_assmt_sbjstinflinac'},
			{name: 'reconpriorbpo4_assmt_incsbjprop'},
			{name: 'reconpriorbpo4_assmt_slsfacts'},
			{name: 'reconpriorbpo4_assmt_sjbglainac'},
			{name: 'reconvalarc_DestVendor_char'},
			{name: 'rmv_concl_fmv_as_is_int'},
			{name: 'rmv_concl_fmv_as_repaired_int'},
			{name: 'rmv_concl_fmv_repair_cost_int'},
			{name: 'rmv_concl_fmv_notes_text'},
			{name: 'recon_Custom1_varchar'},
			{name: 'rmv_bpo_review_fair_market_int'},
			{name: 'recon_OilQuestion1_enum'},
			{name: 'recon_OilQuestion2_enum'},
            {name: 'autoQaResult'},
            {name: 'is_spo'},
            {name: 'rmv_spo_comments_text'},
            {name: 'rmv_prop_current_use_char'},
            {name: 'rmv_prop_proposed_use_char'},
			{name: 'rmv_anc_rq_saleprice_lowest'},
			{name: 'rmv_anc_rq_saleprice_highest'},
			{name: 'rmv_anc_hpro_saleprice_lowest'},
			{name: 'rmv_anc_hpro_saleprice_highest'},
            {name: 'rmv_anc_bracketing_comment'},
			{name: 'rmv_bpo_review_agent_appraiser_char'},
			{name: 'rmv_concl_fmv_estimateddaystosell_char'},
            {name: 'rmv_prop_occupancy_char'},
            {name: 'rmv_prop_defmaint_char'},
            {name: 'rmv_prop_problem_char'},
            {name: 'rmv_oa_provided_char'},
            {name: 'rmv_oa_stated_purpose_varchar'},
            {name: 'rmv_oa_type_of_appr_char'},
            {name: 'rmv_oa_comment_varchar'},
            {name: 'rmv_src_prop_attributes_varchar'},
            {name: 'rmv_src_market_data_varchar'},
            {name: 'rmv_prop_view_varchar'},
            {name: 'rmv_currently_listed_char'},
            {name: 'rmv_current_listing_date'},
            {name: 'rmv_current_list_price_int'},
            {name: 'rmv_current_list_reasonableness_varchar'},
            {name: 'rmv_current_list_src_varchar'},
            {name: 'rmv_gmap_viewable_int'},

            {name: 'reconobsinfl_NearPowerLines_int'},
            {name: 'reconobsinfl_NearHwy_int'},
            {name: 'reconobsinfl_NearRailRoad_int'},
            {name: 'reconobsinfl_NearBusyRoad_int'},
            {name: 'reconobsinfl_NearCommercial_int'},
            {name: 'reconobsinfl_NearEnvHazards_int'},
            {name: 'reconobsinfl_NearAirport_int'},
            {name: 'reconobsinfl_NearCemetary_int'},
            {name: 'reconobsinfl_NearGolfCourse_int'},
            {name: 'reconobsinfl_MountainViews_int'},
            {name: 'reconobsinfl_OnGolfCourse_int'},
            {name: 'reconobsinfl_NearWater_int'},
            {name: 'reconobsinfl_WaterFront_int'},
            {name: 'reconobsinfl_None_int'},
            {name: 'rmv_gmap_clicked_int'},
            {name: 'current_user_job_title'}
		]);

		this.ds = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({
				url: '<?=$this->baseUrl?>/workqueue/userorders'
			}),
			reader: this.reader,
			remoteSort: true,
			baseParams: {
				ordid: '<?=$this->ordid?>',
				isReview: '<?=$this->isReview?>',
				isPeerReview: '<?=$this->isPeerReview?>'
			},
			listeners: {
				scope: this,
				loadexception: function() {
					Ext.Msg.alert('Database Error', 'Orders could not be loaded due to database error.');
				},
				load: function(ds, record, opts) {
					if (ds.getTotalCount()===0) {
					 	Ext.Msg.show({
	                        title: 'No Orders in Queue',
	                        msg: 'There are currently no orders in this queue. Would you like to try to load another order?',
	                        buttons: Ext.Msg.YESNO,
	                        closable: false,
	                        icon: Ext.MessageBox.QUESTION,
	                        scope: this,
	                        fn: function(btn) {
	                                if (btn==='no') {
	                            		window.location = '<?=$this->baseUrl?>/index';
	                                } else {
	                                	this.handlerGetOrder();
	                                }
	                        },
	                        icon: Ext.MessageBox.QUESTION
	                	});

	                	return;
					} else {
						var sm = this.getSelectionModel();
						var rows = sm.getCount();
						if (rows === 0) {
							sm.selectFirstRow();
						}
					}




					/*if (ds.getTotalCount()===0 && initialQueueLoaded) {
						Ext.Msg.show({
							title: 'Server Message',
							msg: 'All orders are currently assigned to reviewers.<br><br>Please wait a moment and try again.',
							buttons: Ext.Msg.OK,
							closable: false,
							icon: Ext.MessageBox.WARNING
						});
						return;
					}
					initialQueueLoaded = true;
					var sm = this.getSelectionModel();
					var rows = sm.getCount();
					if (rows === 0) {
						sm.selectFirstRow();
					}*/
				}
			},
			autoLoad: {
				params: {
					start: 0,
					limit: 25
				}
			}
		});

	    this.cm = new Ext.grid.ColumnModel([
	    	{header: "ID", width: 40, sortable: true, dataIndex: 'recon_ID_int', hidden: true},
			{header: "Order ID", width: 75, sortable: true, dataIndex: 'recon_ord_ID_int', renderer: this.renderExceptionFlag},
			{header: "Address", width: 160, sortable: true, dataIndex: 'recon_Address_Street_char', renderer: this.renderAddress},
			{header: "Status", width: 110, sortable: true, dataIndex: 'recon_Status_char'},
			{header: "Assigned On", width: 110, sortable: true, dataIndex: 'recon_Assigned_datetime'},
			{header: "Assigned To", width: 110, sortable: true, dataIndex: 'recon_AssignedTo_char'},
			{header: "Loan #", width: 80, sortable: true, dataIndex: 'recon_LoanNumber_char'},
			{header: "Loaded On", width: 105, sortable: true, dataIndex: 'recon_Loaded_datetime', renderer: this.renderDate}
		]);

		this.sm = new Ext.grid.RowSelectionModel({
			singleSelect: true,
			listeners: {
				rowselect: this.onMyRowSelect
			}
		});

		this.menu = new Ext.menu.Menu({
			id: 'menu-wq',
			items: [{
				text: 'Open in New Tab',
				iconCls: 'wq-btn-open-tab',
				scope: this,
				handler: function() {
					var dataRecord = this.getSelectionModel().getSelected();
					var fm = new Reconcil.FormCommentBuilder({
						title: 'Questionaire',
						dataRecord: dataRecord,
						closable: true
					});
					// Add Tab
					Ext.getCmp('tb-recon').add(fm);
					Ext.getCmp('tb-recon').setActiveTab(fm);
					Ext.getCmp('tb-recon').doLayout();
				}
			},{
				text: 'Open in New Window',
				iconCls: 'wq-btn-open-window',
				scope: this,
				handler: function() {
					var dataRecord = this.getSelectionModel().getSelected();
					var win = new Ext.Window({
						id: 'win-questionaire',
						title: 'Questionaire',
						width: 700,
						height: 480,
						autoScroll: true
					});
					var fm = new Reconcil.FormCommentBuilder({
						dataRecord: dataRecord
					});
					win.add(fm);
					win.show();
				}
			}]
		});

		Grid_Workqueue.superclass.constructor.call(this, {
			//region: 'west',
			id: 'grid-orders',
			title: 'My Recon. Queue',
			autoScroll: true,
			loadMask: true,
			store: this.ds,
			columns: this.cm,
			sm: this.sm,
			tbar: [{
				text: 'Get Order',
				scope: this,
				hidden:isRemoteAccessSession,
				handler: this.handlerGetOrder
			}],
			bbar: new Ext.PagingToolbar({
				pageSize: 25,
				store: this.ds,
				displayInfo: true,
				width: 220,
				emptyMsg: "No results to display"
			})
		});
	};

	Ext.extend(Grid_Workqueue, Ext.grid.GridPanel, {
		rmvFileList: null,
		rowIndex: 0,

		handlerGetOrder: function() {
			Ext.Ajax.request({
				url: '<?=$this->baseUrl?>/recon/getnextorder',
				method: 'POST',
				params: {
					isPeerReview: '<?=$this->isPeerReview?>'
				},
				success: function(result, options) {
					var Response = Ext.util.JSON.decode(result.responseText);

					if (Response.success===true) {
						Ext.getCmp('grid-orders').getSelectionModel().clearSelections();
						Ext.getCmp('grid-orders').setRowIndex(Ext.getCmp('id_wq_rowindex').getValue());
						Ext.getCmp('grid-orders').getStore().reload();
					} else {
						Ext.Msg.alert('Updated', Response.message);
					}
				},
				failure: function(result, options) {
					Ext.Msg.alert('Critical Error', 'Server Error, please notify IT.');
				}
			});
		},

		renderExceptionFlag: function(v, p, record) {
			var id = record.data.reconvalarcexc_ID_int;
			var status = record.data.reconvalarcexc_Status_enum;

			if (id===null) {
				return '<span class="tdbg-flag-none">' + v + '</span>';
			}

			id = parseInt(id, 10);
			if (Ext.isNumber(id)) {
				if (id > 0) {
					switch (status) {
						case 'New':
						case 'Pending':
							return '<span class="tdbg-flag-red">' + v + '</span>';
						break;

						case 'Resolved':
						case 'Cancelled':
							return '<span class="tdbg-flag-green">' + v + '</span>';
						break;
					}
				}
			}

			return '<span class="tdbg-flag-none">' + v + '</span>';
		},

		renderDate: function(date) {
			if (!date) {
				return '';
			}

			return date.dateFormat('m/d/Y h:i');
		},

		renderAddress: function (value, p, record){
			var addr = record.data.recon_Address_Street_char;
			if (record.data.recon_Address_Line2_char!=='' && record.data.recon_Address_Line2_char!==null) {
				addr += ', ' + record.data.recon_Address_Line2_char;
			}
			addr += '<br/>';
			addr += record.data.recon_Address_City_char;
			addr += ', ' + record.data.recon_Address_State_char + ' ' + record.data.recon_Address_Zip_char;
			return addr;
		},

		setRowIndex: function(rowIndex) {
			this.rowIndex = rowIndex;
		},

		getRowIndex: function() {
			return this.rowIndex;
		},

		selectGmapRow: function(dbValue, idCheckbox, idRadioGroup, disabled) {
			Ext.getCmp(idCheckbox).setValue(false);
			Ext.getCmp(idRadioGroup).setValue([0,0]);

			var rg = Ext.getCmp(idRadioGroup);
			rg.items.items[0].setValue(false); // 0 Index = "No"
			rg.items.items[1].setValue(false); // 1 Index = "Yes"

			if (dbValue == null) {
				rg.items.items[0].setDisabled(true);
				rg.items.items[1].setDisabled(true);
			} else {
				rg.items.items[0].setDisabled(disabled);
				rg.items.items[1].setDisabled(disabled);
			}

			if (dbValue == 1) {
				Ext.getCmp(idCheckbox).setValue(true);
				rg.items.items[0].setValue(false);
				rg.items.items[1].setValue(true);
				return true;
			}

			if (dbValue == 0) {
				Ext.getCmp(idCheckbox).setValue(true);
				rg.items.items[0].setValue(true);
				rg.items.items[1].setValue(false);
				return true;
			}

			if (dbValue == 2) {
				Ext.getCmp(idCheckbox).setValue(true);
				rg.items.items[0].setValue(false);
				rg.items.items[1].setValue(false);
				return true;
			}

			Ext.getCmp(idCheckbox).setDisabled(disabled);

			return true;
		},

		onMyRowSelect: function(sm, rowIndex, record) {
			Ext.getCmp('gmap-section-show-message').setValue('SHOW_MESSAGE_NO');
			//Ext.getCmp('tab-grid-recon').loadDataStore(record.data.recon_ID_int);
			//Ext.getCmp('upload-recon-id').setValue(record.data.recon_ID_int);

			//console.log('    recon_ID_int: ' + record.data.recon_ID_int);
			//console.log('rmv_recon_ID_int: ' + record.data.rmv_recon_ID_int);
			//console.log('recon_ord_ID_int: ' + record.data.recon_ord_ID_int);

			var canAddExceptions = ('<?=$this->canAddException?>'==1)  ? true : false;
			var isReview         = ('<?=$this->isReview?>'==1)         ? true : false;
			var isPeerReview     = ('<?=$this->isPeerReview?>'==1)     ? true : false;
			var canUpdateAddress = ('<?=$this->canUpdateAddress?>'==1) ? true : false;
			
			if (isPeerReview===true) {
				Ext.Ajax.request({
					url: '<?=$this->baseUrl?>/recon/checkuserquota',
					scope: this,
					success: function(response, opts) {
						var rs = Ext.decode(response.responseText);
						if (true === rs.quotaExceeded) {
							Ext.Msg.show({
		                        title: 'Peer Review Quota Exceeded',
		                        msg: rs.message,
		                        buttons: Ext.Msg.OK,
		                        closable: false,
		                        icon: Ext.MessageBox.WARNING,
		                        scope: this,
		                        fn: function() {
									window.location = '<?=$this->baseUrl?>/index';
		                        }
		                	});
						}
					}
				});
			}

			// Remote access sessions will see a different UI
            var isRemoteAccessSession = ('<?= $this->remoteSession; ?>' == 'true');

			//Ext.getCmp('reconvalarc_ID_int').setValue()
			Ext.getCmp('btn-rmv-log-exception').hide();
			if (true===canAddExceptions) {
				Ext.getCmp('btn-rmv-log-exception').show();
			}

			var disableAddressFields = !canUpdateAddress;
			Ext.getCmp('rmv_cust_addr_st_char').setDisabled(disableAddressFields);
			Ext.getCmp('rmv_cust_addr_st_char').readOnly = disableAddressFields;
			Ext.getCmp('rmv_cust_addr_st_char').allowBlank = disableAddressFields;

			Ext.getCmp('rmv_cust_addr_city_char').setDisabled(disableAddressFields);
			Ext.getCmp('rmv_cust_addr_city_char').readOnly = disableAddressFields;
			Ext.getCmp('rmv_cust_addr_city_char').allowBlank = disableAddressFields;

			Ext.getCmp('rmv_cust_addr_state_char').setDisabled(disableAddressFields);
			Ext.getCmp('rmv_cust_addr_state_char').readOnly = disableAddressFields;
			Ext.getCmp('rmv_cust_addr_state_char').allowBlank = disableAddressFields;

			Ext.getCmp('rmv_cust_addr_zip_char').setDisabled(disableAddressFields);
			Ext.getCmp('rmv_cust_addr_zip_char').readOnly = disableAddressFields;
			Ext.getCmp('rmv_cust_addr_zip_char').allowBlank = disableAddressFields;

			// update comments panel for reviewers
			if (true===isReview) {
				Ext.getCmp('btn-recon-approve').show();
				Ext.getCmp('btn-recon-fail').show();
				Ext.getCmp('btn-recon-submitloadnext').hide();
				Ext.getCmp('btn-recon-submit').hide();
				Ext.getCmp('btn-recon-savedraft').hide();
				//Ext.getCmp('recon_rmv_review_comments').enable();
			}

			if (true===isPeerReview) {
				if (record.data.current_user_job_title=='Review Appraisal Manager' || record.data.current_user_job_title=='System Administrator') {
					Ext.getCmp('btn-recon-approve').show();
				}

				Ext.getCmp('btn-recon-fail').show();
				Ext.getCmp('btn-recon-submitloadnext').hide();
				Ext.getCmp('btn-recon-savedraft').hide();	
			}

			Ext.getCmp('recon_rmv_review_failedreason').setValue(record.data.recon_reconfreas_FailedReason_char);
			Ext.getCmp('recon_rmv_review_comments').setValue(record.data.recon_ReviewComment_text);


			// update rmv form
			Ext.getCmp('btn-rmv-save').hide();
			Ext.getCmp('form-rmv').getForm().reset();
			Ext.getCmp("form-rmv").getForm().loadRecord(record);
			Ext.getCmp('form-rmv').dataRecord = record.data;

			Ext.getCmp('form-rmv').updatePriorRMVComments();


			if (Ext.getCmp('rmv_prior_change_notes_text').getValue()!=='Yes' && Ext.getCmp('rmv_prior_change_notes_text').getValue()!=='No') {
				Ext.getCmp('rmv_prior_change_notes_text').setValue('N/A');
			}

			Ext.getCmp('form-rmv').updateBPOAssessments(record);
			Ext.getCmp('form-rmv').updateRealQuestPro(record);
			// bpo2
			if (record.data.reconpriorbpo2_review_assessment_enum == 'Unreliable') {
				Ext.getCmp('reconpriorbpo2_review_assessment_enum').setValue('Unreliable');
				Ext.getCmp('fs-chkgrp-assessment-reconpriorbpo2').show();
				//Ext.getCmp('chkgrp-assessment-reconpriorbpo2').enable();
			} else {
				Ext.getCmp('reconpriorbpo2_review_assessment_enum').setValue('Reliable');
			}
			// bpo3
			if (record.data.reconpriorbpo3_review_assessment_enum == 'Unreliable') {
				Ext.getCmp('reconpriorbpo3_review_assessment_enum').setValue('Unreliable');
				Ext.getCmp('fs-chkgrp-assessment-reconpriorbpo3').show();
				//Ext.getCmp('chkgrp-assessment-reconpriorbpo3').enable();
			} else {
				Ext.getCmp('reconpriorbpo3_review_assessment_enum').setValue('Reliable');
			}
			// bpo4
			if (record.data.reconpriorbpo4_review_assessment_enum == 'Unreliable') {
				Ext.getCmp('reconpriorbpo4_review_assessment_enum').setValue('Unreliable');
				Ext.getCmp('fs-chkgrp-assessment-reconpriorbpo4').show();
				//Ext.getCmp('chkgrp-assessment-reconpriorbpo4').enable();
			} else {
				Ext.getCmp('reconpriorbpo4_review_assessment_enum').setValue('Reliable');
			}



			// update rmv check box violations
			Ext.getCmp('form-rmv').updateViolations(record);
			Ext.getCmp('form-rmv').updateAssessments(record);
			Ext.getCmp('form-rmv').updateRepairs(record);
			Ext.getCmp('form-rmv').updateCompAdj(record);
            Ext.getCmp('form-rmv').initUI();


			Ext.getCmp('btn-recon-savedraft').enable();
			Ext.getCmp('btn-recon-submit').enable();
			Ext.getCmp('btn-recon-submitloadnext').enable();
			// Toggle "Reconciled Market Value" section based on status
			switch (record.data.recon_Status_char) {
				case 'Approved': // legacy
				case 'Order Delivered': // legacy
					Ext.getCmp('btn-recon-savedraft').disable(); // legacy
					Ext.getCmp('btn-recon-submit').disable(); // legacy
					Ext.getCmp('btn-recon-submitloadnext').disable(); // legacy
				break;
				
				/*case 'Assigned':
				case 'Pending Peer Review':
				case 'Draft Saved':
					Ext.getCmp('recon_Status_char').setValue('Loaded');
					break;
					
				case 'Peer Review In Progress':
					Ext.getCmp('recon_Status_char').setValue('In Progress');
					break;
					
				case 'Peer Review Failed':
					Ext.getCmp('recon_Status_char').setValue('Failed');
					break;*/
			}

			// rmv photos
			var dsPhotos = new Ext.data.JsonStore({
				id: 'ds-rmv-photos',
				url: '<?=$this->baseUrl?>/orderupload/getreconphotos',
				baseParams: {
					id: record.data.recon_ID_int
				},
				root: 'photos',
				fields: ['upldfl_uploaded_filename_char', 'upldfl_orig_filename', 'recon_ord_ID_int', 'upldfl_filetype_char', {name:'size', type: 'float'}, {name:'upldfl_uploaded_timestamp', type:'date', dateFormat: 'timestamp'}]
			});
			dsPhotos.load();

			var tplPhotos = new Ext.XTemplate(
				'<tpl for=".">',
				    '<span class="thumb"><img src="<?=$this->baseUrl?>/orderupload/photo/name/{upldfl_uploaded_filename_char}/orderid/{recon_ord_ID_int}" title="{upldfl_orig_filename}"></span>',
				'</tpl>',
		        '<div class="x-clear"></div>'
			);

			var dvPhotos = new Ext.DataView({
        		store: dsPhotos,
        		tpl: tplPhotos,
				autoHeight: true,
	            multiSelect: true,
	            overClass: 'x-view-over',
	            itemSelector: 'div.thumb-wrap',
	            emptyText: 'No photos to display'
        	});

			Ext.getCmp('rmv-photos-view').removeAll();
        	Ext.getCmp('rmv-photos-view').add(dvPhotos);
        	Ext.getCmp('rmv-photos-view').doLayout();

			// update data urls
			Ext.get('recon-queue-related-data').update('');



			if (Ext.getCmp('tab-form-recon')!==undefined && Ext.getCmp('tb-recon')) {
				Ext.getCmp('tb-recon').remove(Ext.getCmp('tab-form-recon'));
			}

			//var formRecon = new Reconcil.queues.FormRecon({
			//	orderId: record.data.recon_ID_int,
			//	files: Ext.getCmp('grid-orders').rmvFileList
			//});
			//Ext.getCmp('tb-recon').add(formRecon);

			//Ext.getCmp('tb-recon').doLayout();
			//Ext.getCmp('tb-recon').setActiveTab(0);

			// update rmv files
			Ext.getCmp('form-rmv').updateRelatedFiles();

			// remove anc data form if exists
			if (Ext.getCmp('form-anc-data') && Ext.getCmp('tb-recon')) {
				Ext.getCmp('tb-recon').remove('form-anc-data', true);
			}

			// Remove training guide button if has nowhere to load
			if (!Ext.get('tb-recon') && Ext.get('btn-training-guide')) {
               Ext.get('btn-training-guide').hide();
            }

			// add and load anc data form
            if (!isRemoteAccessSession) {
    			var fmAncData = new FormAncillaryData;
    			Ext.getCmp('tb-recon').add(fmAncData);
    			Ext.getCmp('tb-recon').setActiveTab(0);
    			Ext.getCmp('tb-recon').doLayout();
    			Ext.getCmp('form-anc-data').loadDataStore(record.data.recon_ID_int);
            }
            else {
                Ext.getCmp('btn-recon-submitloadnext').hide();
            }

			if (record.data.rmv_gmap_viewable_int == 1) {
				Ext.getCmp('opt-gmap-display-property-yes').setValue(true);
				Ext.getCmp('fieldset-ppty-influences').show();

				var disableEachRow = false;
				Ext.getCmp('opt-gmap-noexinfluences').setValue(0);
				if (record.data.reconobsinfl_None_int == 1) {
					disableEachRow = true;
					Ext.getCmp('opt-gmap-noexinfluences').setValue(1);
				}

				var grid = Ext.getCmp('grid-orders');
				grid.selectGmapRow(record.data.reconobsinfl_NearPowerLines_int, 'opt-gmap-powerlines', 'rg-ppty-influences-powerlines', disableEachRow);
				grid.selectGmapRow(record.data.reconobsinfl_NearHwy_int, 'opt-gmap-nearhwy', 'rg-gmap-nearhwy', disableEachRow);
				grid.selectGmapRow(record.data.reconobsinfl_NearRailRoad_int, 'opt-gmap-nearrailroad', 'rg-gmap-nearrailroad', disableEachRow);
				grid.selectGmapRow(record.data.reconobsinfl_NearBusyRoad_int, 'opt-gmap-busyroad', 'rg-gmap-busyroad', disableEachRow);
				grid.selectGmapRow(record.data.reconobsinfl_NearCommercial_int, 'opt-gmap-commercial', 'rg-gmap-commercial', disableEachRow);
				grid.selectGmapRow(record.data.reconobsinfl_NearEnvHazards_int, 'opt-gmap-envhazards', 'rg-gmap-envhazards', disableEachRow);
				grid.selectGmapRow(record.data.reconobsinfl_NearAirport_int, 'opt-gmap-nearairport', 'rg-gmap-nearairport', disableEachRow);
				grid.selectGmapRow(record.data.reconobsinfl_NearCemetary_int, 'opt-gmap-cemetary', 'rg-gmap-cemetary', disableEachRow);
				grid.selectGmapRow(record.data.reconobsinfl_NearGolfCourse_int, 'opt-gmap-neargolf', 'rg-gmap-neargolf', disableEachRow);
				grid.selectGmapRow(record.data.reconobsinfl_MountainViews_int, 'opt-gmap-mtnvws', 'rg-gmap-mtnvws', disableEachRow);
				grid.selectGmapRow(record.data.reconobsinfl_OnGolfCourse_int, 'opt-gmap-golfon', 'rg-gmap-golfon', disableEachRow);
				grid.selectGmapRow(record.data.reconobsinfl_NearWater_int, 'opt-gmap-nearwater', 'rg-gmap-nearwater', disableEachRow);
				grid.selectGmapRow(record.data.reconobsinfl_WaterFront_int, 'opt-gmap-waterfront', 'rg-gmap-waterfront', disableEachRow);
			} else if (record.data.rmv_gmap_viewable_int == 0) {
				Ext.getCmp('opt-gmap-display-property-no').setValue(true);
				Ext.getCmp('fieldset-ppty-influences').hide();
			} else {
				Ext.getCmp('opt-gmap-display-property-hidden').setValue(true);
				Ext.getCmp('fieldset-ppty-influences').hide();
			}

			Ext.getCmp('gmap-section-show-message').setValue('SHOW_MESSAGE_YES');

            if (Ext.get('rmv-related-data') || isRemoteAccessSession) {

                if (Ext.get('rmv-related-data')) {
                    Ext.get('rmv-related-data').update('');
                }

                Ext.Ajax.request({
					url: '<?=$this->baseUrl?>/qa/rmvrelateddata',
					params: {
						orderid: record.data.recon_ord_ID_int,
						tr_addr: record.data.recon_Address_Street_char,
						tr_city: record.data.recon_Address_City_char,
						tr_state: record.data.recon_Address_State_char,
						tr_zip: record.data.recon_Address_Zip_char
					},
					scope: this,
					success: function(response, opts) {
						var rs = Ext.decode(response.responseText);
						var urls = rs.urls;
						var html = '<div style="font-family: Arial; font-size: 75%; text-align: center;">';
						var htmlRMV = '';
						var glue = '&nbsp;&nbsp;|&nbsp;&nbsp;';
						if (Ext.isArray(rs.urls)) {
							for (var i = 0; i < urls.length; i++) {
								htmlRMV += '<li>' + urls[i] + '</li>';
								html += (i > 0) ? glue + urls[i] : urls[i];
							}
						}
						html += '</div>';
						Ext.get('recon-queue-related-data').update(html);
						Ext.getCmp('rmv-gmap-url').setValue(rs.gmaplink);

						var gmapColumnHeader = 'Select all observed factors (regardless of impact) within ' + rs.locationMsg;
						Ext.getCmp('gmap-ppty-infl-distance-placeholder').setValue(gmapColumnHeader);
						if (Ext.getCmp('fieldset-ppty-influences').isVisible()) {
							Ext.getCmp('gmap-column-header-label').setText(gmapColumnHeader);
						}

						if (Ext.get('rmv-related-data')) {
                            Ext.get('rmv-related-data').update(htmlRMV);
						}
					}
				});
			}

			Ext.getCmp('form-rmv').updateStatusPanel(record.data);
			Ext.getCmp('form-rmv').updateOrigCommentsLabel();

			Ext.getCmp('form-recon-comments').resetForm(record.data.recon_ID_int, rowIndex, record.data);
			Ext.getCmp('form-recon-comments').vVariance();
			Ext.getCmp('form-rmv').updatePriorRMVVariance();
			Ext.getCmp('form-rmv').syncReadOnlySubjectData();

			// ------
            // Fair Market Value RMV form handling
            Ext.getCmp('fairMarketCommentsColumn').show(); // Show FMV elements
            Ext.getCmp('fairMarketValuesColumn').show();   // Show FMV elements
            Ext.getCmp('rmv_bpo_review_fair_market_int').show();
            Ext.getCmp('comments_rmv_concl_fmv_as_repaired_int').show();
           	Ext.getCmp('comments_rmv_concl_fmv_repair_cost_int').show();

            // Remove validation checks
            Ext.getCmp('rmv_bpo_review_fair_market_int').allowBlank         = false;
            Ext.getCmp('comments_rmv_concl_fmv_as_is_int').allowBlank       = false;
            Ext.getCmp('comments_rmv_concl_fmv_as_repaired_int').allowBlank = false;
            Ext.getCmp('comments_rmv_concl_fmv_repair_cost_int').allowBlank = false;
            Ext.getCmp('comments_rmv_concl_fmv_estimateddaystosell_char').allowBlank = false;
            Ext.getCmp('rmv_concl_fmv_notes_text').allowBlank               = false;

            var commentsWidth = Ext.getCmp("form-recon-comments").getWidth() - 1010;  // Other elements take up ~1010px when FMV elements are shown
            Ext.getCmp("recon_rmv_review_failedreason").setWidth(commentsWidth);
            Ext.getCmp("recon_rmv_review_comments").setWidth(commentsWidth);

            if (record.get("recon_Custom1_varchar") == 'FMV') {
                // Calculate the new width of the failed review notes based

            } else {
            	Ext.getCmp('rmv_bpo_review_fair_market_int').hide();
            	Ext.getCmp('rmv_bpo_review_fair_market_int').allowBlank         = true;

            	Ext.getCmp('comments_rmv_concl_fmv_as_repaired_int').allowBlank = true;
            	Ext.getCmp('comments_rmv_concl_fmv_repair_cost_int').allowBlank = true;
            	Ext.getCmp('comments_rmv_concl_fmv_as_repaired_int').hide();
            	Ext.getCmp('comments_rmv_concl_fmv_repair_cost_int').hide();

            	Ext.getCmp('fairMarketCommentsColumn').hide();
                Ext.getCmp('rmv_concl_fmv_notes_text').allowBlank               = true;

                var commentsWidth = Ext.getCmp("form-recon-comments").getWidth() - 840;  // Other elements take up ~700px when FMV elements are hidden
                Ext.getCmp("recon_rmv_review_failedreason").setWidth(commentsWidth);
                Ext.getCmp("recon_rmv_review_comments").setWidth(commentsWidth);
            }

			Ext.getCmp('affected_by_oil').setValue('No');
			Ext.getCmp('fm-oil-question-1').hide();
			Ext.getCmp('fm-oil-question-2').hide();
			Ext.getCmp('combo_oil_question1').allowBlank = true;
			Ext.getCmp('combo_oil_question2').allowBlank = true;
			Ext.getCmp('combo_oil_question1').setValue(record.data.recon_OilQuestion1_enum);
			Ext.getCmp('combo_oil_question2').setValue(record.data.recon_OilQuestion2_enum);

			/*Ext.Ajax.request({
				url: '<?=$this->baseUrl?>/workqueue/oilzip',
				params: {
					zip: record.data.recon_Address_Zip_char
				},
				scope: this,
				success: function(response, opts) {
					var rs = Ext.decode(response.responseText);
					if (true === rs.isAffected) {
						Ext.getCmp('affected_by_oil').setValue('Yes');
						Ext.getCmp('fm-oil-question-1').show();
						Ext.getCmp('fm-oil-question-2').show();
						Ext.getCmp('combo_oil_question1').allowBlank = false;
						Ext.getCmp('combo_oil_question2').allowBlank = false;
					}
				}
			});*/

			// if the order is SPO, require the SPO section and display it
			var spoAllowBlank = true;
			var spoVisible = false;
			if (record.data.is_spo == 1) {
				spoAllowBlank = false;
				spoVisible = true;
			}
			Ext.getCmp('rmv_spo_comments_text').allowBlank = spoAllowBlank;
			Ext.getCmp('fs-spo-comments').setVisible(spoVisible);

            if (Ext.getCmp('form-rmv').isAncillaryDataSet()) {
                Ext.getCmp('form-rmv').ancillaryDataChange();
            }

            // Uncomment for debugging and ability to save draft on any order type
            //Ext.getCmp('btn-recon-savedraft').show();
            //Ext.getCmp('btn-recon-savedraft').enable();
		}
	});

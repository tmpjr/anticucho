function addPDFToPanel(panelId, id, title, url) {
	var mPanel = new Ext.ux.MediaPanel({
		id: id,
		title: title,
		height: 400,
		width : 700,
		loadMask: true,
		closable: true,
		mediaCfg:{
			mediaType: 'PDF',
			url: url,
			unsupportedText: 'Acrobat Viewer is not Installed'
		}
	});
	mPanel.renderMedia();

	Ext.getCmp(panelId).add(mPanel);
	Ext.getCmp(panelId).doLayout();
	Ext.getCmp(panelId).setActiveTab(id);
}

Ext.onReady(function(){
	Ext.QuickTips.init();

	// Remote access sessions will see a different UI
	var isRemoteAccessSession = ('<?= $this->remoteSession; ?>' == 'true');

	var masterLayoutConfig = {
	   remoteLayout: {
		   formWidth: 950,
		   defaultTextFieldWidthMicro: 65,
		   defaultTextFieldWidthShort: 300,
		   defaultTextFieldWidthMedium: 85,
		   defaultTextFieldWidthLong: 95,
		   defaultTextFieldWidthComps: 78,
		   compEval: {
			   standard: {
				   width: [0.4, 0.2, 0.2, 0.2],
				   hideSubject: false,
				   subject:{
					   text: "63%",
					   combo: "70%",
					   dollar: "59%"
				   },
				   comp1: {
					   text: "90%",
					   combo: 174,
					   dollar: "85%"
				   },
				   general: {
					   text: "90%",
					   combo: 174,
					   dollar: "85%"
				   }
			   },
			   adj: {
				   width: [0.4, 0.11, 0.091, 0.11, 0.09, 0.11, 0.09],
				   hideSubject: false,
				   subject:{
					   text: "63%",
					   combo: "70%",
					   dollar: "61%"
				   },
				   comp1: {
					   text: "90%",
					   combo: 95,
					   dollar: "65%"
				   },
				   general: {
					   text: "90%",
					   combo: 95,
					   dollar: "65%"
				   }
			   },
			   dynamicAdj: {
				   width: [0.2, 0.2, 0.11, 0.091, 0.11, 0.09, 0.11, 0.09],
				   hideSubject: false,
				   comboWidth: 175,
				   subject:{
					   text: "65%",
					   combo: "70%",
					   dollar: "61%"
				   },
				   comp1: {
					   text: "90%",
					   combo: 95,
					   dollar: "65%"
				   },
				   general: {
					   text: "90%",
					   combo: 95,
					   dollar: "65%"
				   }
			   },
			   concl: {
				   width:[0.51, 0.091, 0.11, 0.09, 0.11, 0.09],
				   comp1LabelStyle: "width: 78%",
				   comp1CommentLabelStyle: "width: 66.1%",
				   comp1: {
					   firstText:"37%",
					   text: "25%",
					   firstDollar: "21.5%",
					   dollar: "65%"
				   },
				   general: {
					   text: "90%",
					   combo: 95,
					   firstDollar: "75%",
					   dollar: "65%"
				   }
			   }
		   },
		   valMisrep: {
			   labelStyle: "width: 220px",
			   violations:{
				   numCols: "auto"
			   }
		   }
	   },
	   defaultLayout: {
		   formWidth: "100%",
		   defaultTextFieldWidthMicro: 65,
		   defaultTextFieldWidthShort: 175,
		   defaultTextFieldWidthMedium: 85,
		   defaultTextFieldWidthLong: 95,
		   defaultTextFieldWidthComps: 78,
		   compEval: {
			   standard: {
				   width: [0, 0.5, 0.25, 0.25],
				   hideSubject: true,
				   subject:{
					   text: "0%",
					   combo: "0%",
					   dollar: "0%"
				   },
				   comp1: {
					   text: "66.1%",
					   combo: 152,
					   dollar: "61.1%"
				   },
				   general: {
					   text: "90%",
					   combo: 152,
					   dollar: "85%"
				   }
			   },
			   adj: {
				   width: [0, 0.39, 0.11, 0.13, 0.12, 0.13, 0.12],
				   hideSubject: true,
				   subject:{
					   text: 0,
					   combo: 0,
					   dollar: 0
				   },
				   comp1: {
					   text: "53%",
					   combo: 85,
					   dollar: "65%"
				   },
				   general: {
					   text: "88%",
					   combo: 80,
					   dollar: "65%"
				   }
			   },
			   dynamicAdj: {
				   width: [0.256, 0, 0.135, 0.11, 0.13, 0.12, 0.13, 0.12],
				   hideSubject: true,
				   comboWidth: 150,
				   subject:{
					   text: "0%",
					   combo: "0%",
					   dollar: "0%"
				   },
				   comp1: {
					   text: "88%",
					   combo: 95,
					   dollar: "65%"
				   },
				   general: {
					   text: "90%",
					   combo: 95,
					   dollar: "65%"
				   }
			   },
			   concl: {
				   width:[0.39, 0.11, 0.13, 0.12, 0.13, 0.12],
				   comp1LabelStyle: "width: 64.4%",
				   comp1CommentLabelStyle: "width: 50%",
				   comp1: {
					   firstText:"66%",
					   text: "25%",
					   firstDollar: "45%",
					   dollar: "65%"
				   },
				   general: {
					   text: "90%",
					   combo: 95,
					   firstDollar: "75%",
					   dollar: "65%"
				   }
			   }
		   },
		   valMisrep: {
			   labelStyle: "width: 220px",
			   violations:{
				   numCols: 3
			   }
		   }
	   }
	};

	FormRMV = function(config) {
		Ext.apply(this, config);

		// Select a layout configuration to use (defined above)
		this.layoutConfig = (isRemoteAccessSession)
						  ? masterLayoutConfig.remoteLayout
						  : masterLayoutConfig.defaultLayout

		FormRMV.superclass.constructor.call(this, {
			id: 'form-rmv',
			//title: 'RMV',
			autoScroll:true,
			border: false,
			frame: true,
			url: '<?=$this->baseUrl?>/qa/savermvdata',
			width: this.layoutConfig.formWidth,
			defaults: {
				msgTarget: 'title'
			},
			buttons: [{
				text: 'Save RMV',
				id: 'btn-rmv-save',
				scope: this,
				handler: this.saveData
			}],
			listeners: {
				afterrender: {
					scope: this,
					fn: function () {
						var timeout,
							_this = this;
						
						timeout = setInterval(
							function() {
								if (_this.isAncillaryDataSet()) {
									_this.ancillaryDataChange();
									clearInterval(timeout);
								}
							},
							100
						);
					}
				}
			},
			items: [{
				xtype: 'hidden',
				id: 'rmv_ID_int',
				value: 0
			},{
				xtype: 'hidden',
				id: 'rmv_recon_ID_int',
				value: 0
			},{
				xtype: 'hidden',
				id: 'recon_ord_ID_int',
				value: 0
			},{
				xtype: 'hidden',
				id: 'recon_FNC_Folder_Num_varchar'
			},{
				xtype: 'hidden',
				id: 'files_has_oa',
				value: 0
			},{
				xtype: 'hidden',
				id: 'files_has_research',
				value: 0
			},{
				xtype: 'hidden',
				id: 'files_has_bporesearch',
				value: 0
			},{
				xtype: 'hidden',
				id: 'files_has_miscresearch',
				value: 0
			},{
				xtype: 'hidden',
				id: 'files_has_oaresearch',
				value: 0
			},{
				xtype: 'hidden',
				id: 'files_has_hpro',
				value: 0
			},{
				xtype: 'hidden',
				id: 'files_has_realquest',
				value: 0
			},{
				xtype: 'hidden',
				id: 'files_has_realquest_current',
				value: 0
			},{
				xtype: 'hidden',
				id: 'realquest_current_count',
				value: 0
			},{
				xtype: 'hidden',
				id: 'reconvalarc_ID_int',
				value: 0
			},{
				xtype: 'hidden',
				id: 'reconpriorbpo2_flag',
				value: 0
			},{
				xtype: 'hidden',
				id: 'reconpriorbpo3_flag',
				value: 0
			},{
				xtype: 'hidden',
				id: 'reconvalarc_DestVendor_char',
				value: 'ES'
			},{
				xtype: 'hidden',
				id: 'reconpriorbpo4_flag',
				value: 0
			},{
				xtype: 'hidden',
				id: 'affected_by_oil',
				value: 'No'
			},{
				xtype: 'hidden',
				id: 'files_has_appraisal_wrapper',
				value: 0
			},{
				xtype: 'hidden',
				id: 'is_spo',
				value: 0
			},{
				xtype: 'hidden',
				id: 'files_has_subject_mls',
				value: 0
			},{
				xtype: 'hidden',
				id: 'gmap-ppty-infl-distance-placeholder',
				value: null
			},{
				xtype: 'hidden',
				id: 'rmv-gmap-url',
				value: null
			},{
				xtype: 'hidden',
				id: 'rmv_gmap_clicked_int',
				value: 0
			},{
				xtype: 'hidden',
				id: 'gmap-section-show-message',
				value: 'SHOW_MESSAGE_NO'
			},{
				id: 'fs-rmv-current-status',
				hidden: false,
				xtype: 'fieldset',
				layout: 'column',
				title: 'RMV Status',
				items: [{
					columnWidth: 0.50,
					layout: 'form',
					labelWidth: 110,
					items: [{
						id: 'recon_status_age',
						xtype: 'displayfield',
						fieldLabel: 'Age',
						listeners: {
							hide: this.onHide,
							show: this.onShow
						},
						hidden: true
					},{
						id: 'recon_AssignedTo_char',
						xtype: 'displayfield',
						fieldLabel: 'Assigned To',
						listeners: {
							hide: this.onHide,
							show: this.onShow
						},
						hidden: true
					},{
						id: 'recon_ReconciledBy_char',
						xtype: 'displayfield',
						fieldLabel: 'Reconciled By',
						listeners: {
							hide: this.onHide,
							show: this.onShow
						},
						hidden: true
					},{
						id: 'recon_ReviewUser_char',
						xtype: 'displayfield',
						fieldLabel: 'Reviewed By',
						listeners: {
							hide: this.onHide,
							show: this.onShow
						},
						hidden: true
					}]
				},{
					columnWidth: 0.50,
					layout: 'form',
					labelWidth: 110,
					items: [{
						id: 'recon_Status_char',
						xtype: 'displayfield',
						fieldLabel: 'Current Status',
						listeners: {
							hide: this.onHide,
							show: this.onShow
						},
						hidden: true
					},{
						id: 'recon_status_assigned',
						xtype: 'displayfield',
						fieldLabel: 'Assigned',
						listeners: {
							hide: this.onHide,
							show: this.onShow
						},
						hidden: true
					},{
						id: 'recon_status_reconciled',
						xtype: 'displayfield',
						fieldLabel: 'Reconciled',
						listeners: {
							hide: this.onHide,
							show: this.onShow
						},
						hidden: true
					},{
						id: 'recon_status_reviewed',
						xtype: 'displayfield',
						fieldLabel: 'Reviewed',
						listeners: {
							hide: this.onHide,
							show: this.onShow
						},
						hidden: true
					}]
				},{
					columnWidth: 1.00,
					layout: 'form',
					labelWidth: 110,
					items: [{
						id: 'recon_exceptions_reasons',
						xtype: 'displayfield',
						fieldLabel: 'Exception Reasons',
						listeners: {
							hide: this.onHide,
							show: this.onShow
						},
						hidden: true
					}]
				},{
					columnWidth: 1.00,
					layout: 'form',
					labelWidth: 110,
					items: [{
						id: 'reconvalarcexc_InitialComments_char',
						xtype: 'displayfield',
						fieldLabel: 'Exception Comments',
						listeners: {
							hide: this.onHide,
							show: this.onShow
						},
						hidden: true
					}]
				},{
					columnWidth: 1.00,
					layout: 'form',
					labelWidth: 110,
					items: [{
						id: 'reconvalarcexc_ReviewComments_char',
						xtype: 'displayfield',
						fieldLabel: 'Resolution Comments',
						listeners: {
							hide: this.onHide,
							show: this.onShow
						},
						hidden: true
					}]
				},{
					columnWidth: 1.00,
					layout: 'form',
					labelWidth: 110,
					items: [{
						id: 'autoQaResult',
						xtype: 'displayfield',
						fieldLabel: 'Manager Escalation',
						listeners: {
							hide: this.onHide,
							show: this.onShow
						},
						hidden: true
					}]
				},{
					columnWidth: 0.50,
					layout: 'form',
					labelWidth: 110,
					items: [{
						id: 'reconnt_rejected_by',
						xtype: 'displayfield',
						fieldLabel: 'Rejected By',
						listeners: {
							hide: this.onHide,
							show: this.onShow
						},
						hidden: true
					}]
				},{
					columnWidth: 0.50,
					layout: 'form',
					labelWidth: 110,
					items: [{
						id: 'reconnt_inserted_datetime',
						xtype: 'displayfield',
						fieldLabel: 'Rejected',
						listeners: {
							hide: this.onHide,
							show: this.onShow
						},
						hidden: true
					}]
				},{
					columnWidth: 1.00,
					layout: 'form',
					labelWidth: 110,
					items: [{
						id: 'reconnt_note_text',
						xtype: 'displayfield',
						fieldLabel: 'Reject Note',
						listeners: {
							hide: this.onHide,
							show: this.onShow
						},
						hidden: true
					}]
				},{
					xtype: 'button',
					id: 'btn-rmv-log-exception',
					hidden: true,
					iconCls: 'btn-kghostview',
					text: 'Log Exception',
					handler: this.logException
				}
				]
			},{
				xtype: 'fieldset',
				title: 'Related Files',
				hidden:  isRemoteAccessSession,
				items: [{
					id: 'rmv-related-files',
					border: false,
					frame: false,
					html: ''
				},{
					id: 'btn-upload-files',
					style: 'margin-top: 5px',
					iconCls: 'btn-photo',
					xtype: 'button',
					text: 'Manage All Files',
					handler: function() {
						var reconId = Ext.getCmp('rmv_recon_ID_int').getValue();

						var gridFM = new Grid_FileManager({ reconId: reconId });
						gridFM.loadData();

						var winFM = new Window_FileManager();
						winFM.add(gridFM);
						winFM.doLayout();
						winFM.show();
					}
				}]
			},{
				xtype: 'fieldset',
				id: 'rmv-photos-view',
				layout: 'fit',
				title: 'Available Photos',
				hidden: true
				//hidden:  isRemoteAccessSession
			},{
				xtype: 'fieldset',
				layout: 'column',
				title: 'Current System Information',
				items: [{
					columnWidth: 0.50,
					layout: 'form',
					defaults: {
						width: this.layoutConfig.defaultTextFieldWidthShort
					},
					items: [{
						xtype: 'textfield',
						id: 'rmv_loan_num_char',
						fieldLabel: 'Loan Number',
						readOnly: true,
						selectOnFocus: true
					},{
						xtype: 'textfield',
						id: 'rmv_cust_name_char',
						fieldLabel: 'Customer',
						readonly: true,
						disabled: true
					},{
						xtype: 'textfield',
						id: 'rmv_cust_collateral_prop_char',
						fieldLabel: 'Collat',
						readOnly: isRemoteAccessSession
					},{
						xtype: 'textfield',
						id: 'rmv_cust_addr_st_char',
						fieldLabel: 'Address',
						readonly: true,
						disabled: true
					},{
						xtype: 'textfield',
						id: 'rmv_cust_addr_city_char',
						fieldLabel: 'City',
						readonly: true,
						disabled: true
					},{
						xtype: 'combostates',
						id: 'rmv_cust_addr_state_char',
						fieldLabel: 'State',
						readonly: true,
						disabled: true
					},{
						xtype: 'textfield',
						id: 'rmv_cust_addr_zip_char',
						fieldLabel: 'Zip',
						readonly: true,
						disabled: true
					},{
						xtype: 'textfield',
						id: 'rmv_channel_char',
						fieldLabel: 'Channel',
						readOnly: isRemoteAccessSession
					},{
						xtype: 'textfield',
						id: 'rmv_system_char',
						fieldLabel: 'System',
						readOnly: isRemoteAccessSession
					},{
						xtype: 'textfield',
						id: 'rmv_invest_nbr_char',
						fieldLabel: 'Invest Nbr.',
						readOnly: isRemoteAccessSession
					},{
						xtype: 'textfield',
						id: 'rmv_current_prop_type_enum',
						fieldLabel: 'Prop. Type',
						readOnly: isRemoteAccessSession
					},{
						xtype: 'textfield',
						id: 'rmv_lien_char',
						fieldLabel: 'Lien',
						readOnly: isRemoteAccessSession
					},{
						xtype: 'textfield',
						id: 'rmv_affiliate_char',
						fieldLabel: 'Affiliate',
						readOnly: isRemoteAccessSession
					}]
				},{
					columnWidth: 0.50,
					layout: 'form',
					defaults: {
						width: this.layoutConfig.defaultTextFieldWidthShort
					},
					items: [{
						xtype: 'datermv',
						id: 'rmv_orig_date',
						allowBlank: false,
						maxValue: new Date().add(Date.DAY, -1),
						minValue: '01/01/1990',
						fieldLabel: '<span style="color:red;">*</span>Orig. Date',
						listeners: {
							scope: this,
							blur: this.updateOrigCommentsLabel
						}
					},{
						xtype: 'dollarfield',
						id: 'rmv_orig_amount_int',
						fieldLabel: 'Orig. Amt.'
					},{
						xtype: 'dollarfield',
						id: 'rmv_orig_app_value_int',
						allowBlank: false,
						fieldLabel: '<span style="color:red;">*</span>Orig.App.Val.',
						listeners: {
							scope: this,
							blur: this.updateOrigCommentsLabel
						}
					},{
						xtype: 'textfield',
						id: 'rmv_interest_rate_float',
						fieldLabel: 'Interest Rate',
						readOnly: isRemoteAccessSession
					},{
						xtype: 'textfield',
						id: 'rmv_financial_char',
						fieldLabel: 'Financial',
						readOnly: isRemoteAccessSession
					},{
						xtype: 'textfield',
						id: 'rmv_b1_fortracs_char',
						fieldLabel: 'B1 Fortracs',
						readOnly: isRemoteAccessSession
					},{
						id: 'rmv_short_form_enum',
						xtype: 'combo',
						fieldLabel: 'Short Form',
						store: new Ext.data.SimpleStore({
							fields: ['yn'],
							data : [
								['Yes'],
								['No']
							]
						}),
						displayField:'yn',
						valueField:'yn',
						forceSelection: true,
						editable:true,
						triggerAction: 'all',
						mode: 'local',
						selectOnFocus:true,
						listeners: {
							scope: this,
							select: function(o, r, i) {
								var visible = true;
								var allowBlank = false;
								var hasOA = (0==Ext.getCmp('files_has_oa').getValue()) ? false : true;

								if(r.get('yn')=='No') {
									this.requireAppraisalInfo();
								} else {
									this.requireAppraisalInfo();

									// Short form and has OA file
									if (false==hasOA) {
										visible = false;
										allowBlank = true;
									}
								}

								Ext.getCmp('origination_comments_section').setVisible(visible);
								Ext.getCmp('rmv_orig_app_value_int').allowBlank = allowBlank;
							}
						},
						disabled: isRemoteAccessSession
					},{
						xtype: 'datefield',
						id: 'rmv_next_payment_date',
						fieldLabel: 'Next Pmt.',
						disabled: isRemoteAccessSession
					},{
						xtype: 'textfield',
						id: 'rmv_mi_comp_char',
						fieldLabel: 'MI Comp',
						readOnly: isRemoteAccessSession
					},{
						xtype: 'textfield',
						id: 'rmv_mi_cov_char',
						fieldLabel: 'MI Cov.',
						readOnly: isRemoteAccessSession
					},{
						xtype: 'dollarfield',
						id: 'rmv_current_principal_int',
						fieldLabel: 'Curr. Prin',
						readOnly: isRemoteAccessSession
					},{
						xtype: 'textfield',
						id: 'rmv_loan_type_char',
						fieldLabel: 'Loan Type',
						readOnly: isRemoteAccessSession
					},{
						xtype: 'textfield',
						id: 'rmv_appr_type_char',
						fieldLabel: 'Appr Type',
						readOnly: isRemoteAccessSession
					},{
						xtype: 'dollarfield',
						id: 'rmv_appr_amount_int',
						fieldLabel: 'Appr Amt.',
						readOnly: isRemoteAccessSession
					}]
				}]
			},{
				xtype: 'fieldset',
				layout: 'column',
				//bodyStyle: 'padding: 2px',
				id: 'comments_subject_property_neighborhood',
				title: 'Comments on Subject Property Neighborhood',
				items: [{
					columnWidth: 0.20,
					xtype: 'button',
					text: 'Open Google Map',
					iconCls: 'btn-map',
					handler: function() {
						var url = Ext.getCmp('rmv-gmap-url').getValue();
						window.open(url);
						Ext.getCmp('rmv_gmap_clicked_int').setValue(1);
					}
				},{
					columnWidth: 0.60,
					xtype: 'label',
					style: 'font-size: 12px',
					html: '&nbsp;Does the Google Map (satellite view) display the subject property?'
				},{
					xtype: 'radio',
					id: 'opt-gmap-display-property-hidden',
					hidden: true,
					name: 'rmv_gmap_viewable_int',
					inputValue: 'void'
				},{
					xtype: 'radio',
					hideLabel: true,
					columnWidth: 0.10,
					id: 'opt-gmap-display-property-no',
					name: 'rmv_gmap_viewable_int',
					boxLabel: 'No',
					inputValue: 0,
					listeners: {
						check: function(radio, isChecked) {
							if (isChecked) {
								Ext.getCmp('fieldset-ppty-influences').hide();
							} else {
								Ext.getCmp('fieldset-ppty-influences').show();
							}
						}
					}
				},{
					xtype: 'radio',
					hideLabel: true,
					columnWidth: 0.10,
					id: 'opt-gmap-display-property-yes',
					name: 'rmv_gmap_viewable_int',
					boxLabel: 'Yes',
					inputValue: 1,
					listeners: {
						check: function(radio, isChecked) {
							if (isChecked) {
								Ext.getCmp('fieldset-ppty-influences').show();
								Ext.getCmp('gmap-column-header-label').setText(Ext.getCmp('gmap-ppty-infl-distance-placeholder').getValue());
							} else {
								Ext.getCmp('fieldset-ppty-influences').hide();
							}
						}
					}
				},{
					xtype: 'fieldset',
					bodyStyle: 'padding: 5px',
					layout: 'column',
					labelAlign: 'top',
					hidden: true,
					id: 'fieldset-ppty-influences',
					title: 'Map Options',
					items: [{
						xtype: 'label',
						id: 'gmap-column-header-label',
						columnWidth: 0.65,
						style: 'font-size: 12px; font-weight: bold',
						text: ''
					},{
						xtype: 'label',
						columnWidth: 0.35,
						style: 'font-size: 12px; font-weight: bold',
						html: 'Does factor impact value or marketability?'
					},{
						xtype: 'checkbox',
						columnWidth: 0.65,
						id: 'opt-gmap-powerlines',
						labelStyle: 'font-size: 12px',
						boxLabel: '<span style="font-size: 12px">Powerlines near property</span>',
						listeners: {
							scope: this,
							check: function(cb, isChecked) {
								this.toggleMapOptionRadios('rg-ppty-influences-powerlines', isChecked);
							}
						}
					},{
						xtype: 'radiogroup',
						id: 'rg-ppty-influences-powerlines',
						allowBlank: true,
						columnWidth: 0.35,
						hideLabel: true,
						items: [{
							boxLabel: 'No',
							disabled: true,
							name: 'opt-yn-ppty-influences-powerlines',
							inputValue: 'no'
						},{
							boxLabel: 'Yes',
							disabled: true,
							name: 'opt-yn-ppty-influences-powerlines',
							inputValue: 'yes'
						}]
					},{
						xtype: 'checkbox',
						columnWidth: 0.65,
						id: 'opt-gmap-nearhwy',
						labelStyle: 'font-size: 12px',
						boxLabel: '<span style="font-size: 12px">Property on or near highway</span>',
						listeners: {
							scope: this,
							check: function(cb, isChecked) {
								this.toggleMapOptionRadios('rg-gmap-nearhwy', isChecked);
							}
						}
					},{
						xtype: 'radiogroup',
						id: 'rg-gmap-nearhwy',
						columnWidth: 0.35,
						hideLabel: true,
						items: [{
							boxLabel: 'No',
							disabled: true,
							name: 'opt-yn-ppty-influences-nearhwy',
							inputValue: 'no'
						},{
							boxLabel: 'Yes',
							disabled: true,
							name: 'opt-yn-ppty-influences-nearhwy',
							inputValue: 'yes'
						}]
					},{
						xtype: 'checkbox',
						columnWidth: 0.65,
						id: 'opt-gmap-nearrailroad',
						labelStyle: 'font-size: 12px',
						boxLabel: '<span style="font-size: 12px">Property near railroad</span>',
						listeners: {
							scope: this,
							check: function(cb, isChecked) {
								this.toggleMapOptionRadios('rg-gmap-nearrailroad', isChecked);
							}
						}
					},{
						xtype: 'radiogroup',
						id: 'rg-gmap-nearrailroad',
						columnWidth: 0.35,
						hideLabel: true,
						items: [{
							boxLabel: 'No',
							disabled: true,
							name: 'opt-yn-ppty-influences-nearrailroad',
							inputValue: 'no'
						},{
							boxLabel: 'Yes',
							disabled: true,
							name: 'opt-yn-ppty-influences-nearrailroad',
							inputValue: 'yes'
						}]
					},{
						xtype: 'checkbox',
						columnWidth: 0.65,
						id: 'opt-gmap-busyroad',
						labelStyle: 'font-size: 12px',
						boxLabel: '<span style="font-size: 12px">Property on or near busy road</span>',
						listeners: {
							scope: this,
							check: function(cb, isChecked) {
								this.toggleMapOptionRadios('rg-gmap-busyroad', isChecked);
							}
						}
					},{
						xtype: 'radiogroup',
						id: 'rg-gmap-busyroad',
						columnWidth: 0.35,
						hideLabel: true,
						items: [{
							boxLabel: 'No',
							disabled: true,
							name: 'opt-yn-ppty-influences-busyroad',
							inputValue: 'no'
						},{
							boxLabel: 'Yes',
							disabled: true,
							name: 'opt-yn-ppty-influences-busyroad',
							inputValue: 'yes'
						}]
					},{
						xtype: 'checkbox',
						columnWidth: 0.65,
						id: 'opt-gmap-commercial',
						labelStyle: 'font-size: 12px',
						boxLabel: '<span style="font-size: 12px">Property near commercial</span>',
						listeners: {
							scope: this,
							check: function(cb, isChecked) {
								this.toggleMapOptionRadios('rg-gmap-commercial', isChecked);
							}
						}
					},{
						xtype: 'radiogroup',
						id: 'rg-gmap-commercial',
						columnWidth: 0.35,
						hideLabel: true,
						items: [{
							boxLabel: 'No',
							disabled: true,
							name: 'opt-yn-ppty-influences-commercial',
							inputValue: 'no'
						},{
							boxLabel: 'Yes',
							disabled: true,
							name: 'opt-yn-ppty-influences-commercial',
							inputValue: 'yes'
						}]
					},{
						xtype: 'checkbox',
						columnWidth: 0.65,
						id: 'opt-gmap-envhazards',
						labelStyle: 'font-size: 12px',
						boxLabel: '<span style="font-size: 12px">Environmental hazards observed near property</span>',
						listeners: {
							scope: this,
							check: function(cb, isChecked) {
								this.toggleMapOptionRadios('rg-gmap-envhazards', isChecked);
							}
						}
					},{
						xtype: 'radiogroup',
						id: 'rg-gmap-envhazards',
						columnWidth: 0.35,
						hideLabel: true,
						items: [{
							boxLabel: 'No',
							disabled: true,
							name: 'opt-yn-ppty-influences-envhazards',
							inputValue: 'no'
						},{
							boxLabel: 'Yes',
							disabled: true,
							name: 'opt-yn-ppty-influences-envhazards',
							inputValue: 'yes'
						}]
					},{
						xtype: 'checkbox',
						columnWidth: 0.65,
						id: 'opt-gmap-nearairport',
						labelStyle: 'font-size: 12px',
						boxLabel: '<span style="font-size: 12px">Property near airport</span>',
						listeners: {
							scope: this,
							check: function(cb, isChecked) {
								this.toggleMapOptionRadios('rg-gmap-nearairport', isChecked);
							}
						}
					},{
						xtype: 'radiogroup',
						id: 'rg-gmap-nearairport',
						columnWidth: 0.35,
						hideLabel: true,
						items: [{
							boxLabel: 'No',
							disabled: true,
							name: 'opt-yn-ppty-influences-nearairport',
							inputValue: 'no'
						},{
							boxLabel: 'Yes',
							disabled: true,
							name: 'opt-yn-ppty-influences-nearairport',
							inputValue: 'yes'
						}]
					},{
						xtype: 'checkbox',
						columnWidth: 0.65,
						id: 'opt-gmap-cemetary',
						labelStyle: 'font-size: 12px',
						boxLabel: '<span style="font-size: 12px">Property near cemetary</span>',
						listeners: {
							scope: this,
							check: function(cb, isChecked) {
								this.toggleMapOptionRadios('rg-gmap-cemetary', isChecked);
							}
						}
					},{
						xtype: 'radiogroup',
						id: 'rg-gmap-cemetary',
						columnWidth: 0.35,
						hideLabel: true,
						items: [{
							boxLabel: 'No',
							disabled: true,
							name: 'opt-yn-ppty-influences-cemetary',
							inputValue: 'no'
						},{
							boxLabel: 'Yes',
							disabled: true,
							name: 'opt-yn-ppty-influences-cemetary',
							inputValue: 'yes'
						}]
					},{
						columnWidth: 1.00,
						xtype: 'label',
						html: '<hr style="color: #ccc"/>'
					},{
						xtype: 'checkbox',
						columnWidth: 0.65,
						id: 'opt-gmap-neargolf',
						labelStyle: 'font-size: 12px',
						boxLabel: '<span style="font-size: 12px">Property near golf course</span>',
						listeners: {
							scope: this,
							check: function(cb, isChecked) {
								this.toggleMapOptionRadios('rg-gmap-neargolf', isChecked);
							}
						}
					},{
						xtype: 'radiogroup',
						id: 'rg-gmap-neargolf',
						columnWidth: 0.35,
						hideLabel: true,
						items: [{
							boxLabel: 'No',
							disabled: true,
							name: 'opt-yn-ppty-influences-neargolf',
							inputValue: 'no'
						},{
							boxLabel: 'Yes',
							disabled: true,
							name: 'opt-yn-ppty-influences-neargolf',
							inputValue: 'yes'
						}]
					},{
						xtype: 'checkbox',
						columnWidth: 0.65,
						id: 'opt-gmap-mtnvws',
						labelStyle: 'font-size: 12px',
						boxLabel: '<span style="font-size: 12px">Property has mountain views</span>',
						listeners: {
							scope: this,
							check: function(cb, isChecked) {
								this.toggleMapOptionRadios('rg-gmap-mtnvws', isChecked);
							}
						}
					},{
						xtype: 'radiogroup',
						id: 'rg-gmap-mtnvws',
						columnWidth: 0.35,
						hideLabel: true,
						items: [{
							boxLabel: 'No',
							disabled: true,
							name: 'opt-yn-ppty-influences-mtnvws',
							inputValue: 'no'
						},{
							boxLabel: 'Yes',
							disabled: true,
							name: 'opt-yn-ppty-influences-mtnvws',
							inputValue: 'yes'
						}]
					},{
						xtype: 'checkbox',
						columnWidth: 0.65,
						id: 'opt-gmap-golfon',
						labelStyle: 'font-size: 12px',
						boxLabel: '<span style="font-size: 12px">Property on golf course</span>',
						listeners: {
							scope: this,
							check: function(cb, isChecked) {
								this.toggleMapOptionRadios('rg-gmap-golfon', isChecked);
							}
						}
					},{
						xtype: 'radiogroup',
						id: 'rg-gmap-golfon',
						columnWidth: 0.35,
						hideLabel: true,
						items: [{
							boxLabel: 'No',
							disabled: true,
							name: 'opt-yn-ppty-influences-golfon',
							inputValue: 'no'
						},{
							boxLabel: 'Yes',
							disabled: true,
							name: 'opt-yn-ppty-influences-golfon',
							inputValue: 'yes'
						}]
					},{
						xtype: 'checkbox',
						columnWidth: 0.65,
						id: 'opt-gmap-nearwater',
						labelStyle: 'font-size: 12px',
						boxLabel: '<span style="font-size: 12px">Property adjacent to or near water</span>',
						listeners: {
							scope: this,
							check: function(cb, isChecked) {
								this.toggleMapOptionRadios('rg-gmap-nearwater', isChecked);
							}
						}
					},{
						xtype: 'radiogroup',
						id: 'rg-gmap-nearwater',
						columnWidth: 0.35,
						hideLabel: true,
						items: [{
							boxLabel: 'No',
							disabled: true,
							name: 'opt-yn-ppty-influences-nearwater',
							inputValue: 'no'
						},{
							boxLabel: 'Yes',
							disabled: true,
							name: 'opt-yn-ppty-influences-nearwater',
							inputValue: 'yes'
						}]
					},{
						xtype: 'checkbox',
						columnWidth: 0.65,
						id: 'opt-gmap-waterfront',
						labelStyle: 'font-size: 12px',
						boxLabel: '<span style="font-size: 12px">Property is waterfront</span>',
						listeners: {
							scope: this,
							check: function(cb, isChecked) {
								this.toggleMapOptionRadios('rg-gmap-waterfront', isChecked);
							}
						}
					},{
						xtype: 'radiogroup',
						id: 'rg-gmap-waterfront',
						columnWidth: 0.35,
						hideLabel: true,
						items: [{
							boxLabel: 'No',
							disabled: true,
							name: 'opt-yn-ppty-influences-waterfront',
							inputValue: 'no'
						},{
							boxLabel: 'Yes',
							disabled: true,
							name: 'opt-yn-ppty-influences-waterfront',
							inputValue: 'yes'
						}]
					},{
						columnWidth: 1.00,
						xtype: 'label',
						html: '<hr style="color: #ccc"/>'
					},{
						xtype: 'checkbox',
						columnWidth: 1.00,
						id: 'opt-gmap-noexinfluences',
						boxLabel: '<span style="font-size: 12px">No external influences (clears ALL responses above)</span>',
						listeners: {
							scope: this,
							check: function(cb, isChecked) {								
								var showMessage = Ext.getCmp('gmap-section-show-message').getValue();
								if (showMessage == 'SHOW_MESSAGE_YES') {
									if (isChecked) {
										Ext.Msg.show({
											title: 'CONFIRM: NO EXTERNAL INFLUENCES',
											msg: 'Clicking "OK" will CLEAR all data from this section.',
											buttons: Ext.Msg.OKCANCEL,
											icon: Ext.Msg.WARNING,
											scope: this,
											fn: function(btn, text) {
												if (btn == 'ok') {
													Ext.getCmp('fieldset-ppty-influences').items.each(function(item, index, length) {
														if (item.xtype == 'checkbox' && item.id != 'opt-gmap-noexinfluences') {
															item.setValue(false);
															item.disable();
														}
														if (item.xtype == 'radiogroup') {
															item.items.items[0].setValue(false);
															item.items.items[1].setValue(false);
															item.items.items[0].disable();
															item.items.items[1].disable();
														}
													});
												} else {
													cb.setValue(false);
												}
											}
										});
									} else {
										Ext.getCmp('fieldset-ppty-influences').items.each(function(item, index, length) {
											if (item.xtype == 'checkbox' && item.id != 'opt-gmap-noexinfluences') {
												item.enable();
											}
											//if (item.xtype == 'radiogroup') {
											//	item.items.items[0].enable();
											//	item.items.items[1].enable();
											//}
										});
									}
								}
							}
						}
					}]
				}]
			},{
				xtype: 'fieldset',
				layout: 'form',
				id: "origination_comments_section",
				title: 'Comments On Origination Value Report',
				items: [{
					columnWidth: 1.0,
					layout: "form",
					items:[{
						xtype: 'combo',
						id: 'rmv_oa_provided_char',
						fieldLabel: '<span style="color:red;">*</span> Was an O.A. File Provided?',
						labelStyle: 'width:300px;',
						style:{marginLeft: '-13px'},
						listAlign: 'br',
						readOnly: isRemoteAccessSession,
						store: new Ext.data.SimpleStore({
							fields: ['yn'],
							data : [
								['Yes'],
								['No']
							]
						}),
						displayField:'yn',
						valueField:'yn',
						forceSelection: true,
						editable:true,
						triggerAction: 'all',
						mode: 'local',
						selectOnFocus:true,
						allowBlank: false,
						listeners: {
							collapse: this.generateOAComments,
							change: this.generateOAComments
						}
					}]
				},{
					columnWidth: 1.0,
					layout: "form",
					id: 'generated-oa-comments',
					hidden:true,
					items:[{
						columnWidth: 1.00,
						layout: 'form',
						items: [
							{
								xtype: 'combo',
								id: 'rmv_oa_stated_purpose_varchar',
								fieldLabel: '<span style="color:red;">*</span> What is the stated Loan Purpose on the OA?',
								labelStyle: 'width:300px;',
								style:{marginLeft: '-13px'},
								readOnly: isRemoteAccessSession,
								listAlign: 'br',
								store: new Ext.data.SimpleStore({
									fields: ['type'],
									data : [
										['refinance'],
										['purchase'],
										['unknown'],
										['market value estimate']
									]
								}),
								displayField:'type',
								valueField:'type',
								forceSelection: true,
								editable:true,
								triggerAction: 'all',
								mode: 'local',
								selectOnFocus:true,
								listeners: {
									collapse: this.generateOAComments,
									change: this.generateOAComments
								}
							},{
								xtype: 'combo',
								id: 'rmv_oa_type_of_appr_char',
								fieldLabel: '<span style="color:red;">*</span> Type of appraisal',
								labelStyle: 'width:300px;',
								style:{marginLeft: '-13px'},
								listAlign: 'br',
								readOnly: isRemoteAccessSession,
								store: new Ext.data.SimpleStore({
									fields: ['apprType'],
									data : [
										['Interior'],
										['Exterior']
									]
								}),
								displayField:'apprType',
								valueField:'apprType',
								forceSelection: true,
								editable:true,
								triggerAction: 'all',
								mode: 'local',
								selectOnFocus:true,
								listeners: {
									collapse: this.generateOAComments,
									change: this.generateOAComments
								}
							}]
					},{
						columnWidth: 1.00,
						layout: 'form',
						items: [{
							html:'<label class="x-form-item-label" style="font-size:12px;margin-bottom:3px;">Your answers above have been combined to create the following comment that will be sent to the client:</label>'
						},{
							xtype: 'textarea',
							id: 'rmv_oa_comment_varchar',
							anchor: '95%',
							allowBlank: true,
							hideLabel: true,
							readOnly: true,
							editable: false,
							style:{color:'#000',background:'#F5F7F7',height:'50px'}
						},{
							html:'<div style="border-top: 1px dotted #000000; margin-top:10px;font-size:10px;">&nbsp;</div>'
						}]
					}]
				},{
					columnWidth:1.0,
					layout:'form',
					labelAlign: 'top',
					items:[{
						xtype: 'textarea',
						id: 'rmv_origination_comments_text',
						fieldLabel: '<span style="color:red;">*</span> Origination Appraisal Comments',
						anchor: '95%',
						allowBlank: false
					}]
				},{
					columnWidth: 1.00,
					id: 'orig_comments_label',
					xtype: 'panel',
					style: 'padding: 4px 0; font: 12px arial; font-weight: bold',
					html: 'Considering the Orig.Date: and Orig.App.Val $:'
				},{
					columnWidth: 1.00,
					layout: 'form',
					defaults: {
						width: this.defaultTextFieldWidthLong
					},
					labelSeparator: '?',
					items: [{
						id: 'rmv_misrep_violations_enum',
						xtype: 'combo',
						fieldLabel: 'Is Value Misrepresentation Suspected',
						labelStyle: this.layoutConfig.valMisrep.labelStyle,
						listAlign: "br",
						store: new Ext.data.SimpleStore({
							fields: ['yn'],
							data : [
								['Yes'],
								['No']
							]
						}),
						displayField:'yn',
						valueField:'yn',
						forceSelection: true,
						editable:true,
						triggerAction: 'all',
						mode: 'local',
						selectOnFocus:true,
						lazyRender:true,
						lazyInit:true,
						listeners: {
							select: function(o, r, i) {
								if(r.get('yn')=='Yes') {
									Ext.getCmp('fs-chkgrp-violations').show();
									Ext.getCmp('chkgrp-violotions').enable();
								} else {
									Ext.getCmp('fs-chkgrp-violations').hide();
									Ext.getCmp('chkgrp-violotions').disable();
								}
							}
						}
					}]
				},{
					columnWidth: 1.00,
					layout: 'form',
					id: 'fs-chkgrp-violations',
					hidden: true,
					items: [{
						id: 'chkgrp-violotions',
						xtype: 'checkboxgroup',
						fieldLabel: 'Select Up To Three Violations',
						columns: this.layoutConfig.valMisrep.violations.numCols,
						items: [
							{ boxLabel: 'Bad Data', id: 'reconrmvvio_bad_data', value: 1},
							{ boxLabel: 'Unverifiable Sales', id: 'reconrmvvio_fraud_sales', value: 1},
							{ boxLabel: 'Inappropriate Adjustments', id: 'reconrmvvio_inappr_adj', value: 1},
							{ boxLabel: 'Inappropriate Comps', id: 'reconrmvvio_inappr_comps', value: 1},
							{ boxLabel: 'Incorrect Adjustments', id: 'reconrmvvio_incorrect_adj', value: 1},
							{ boxLabel: 'Incorrect Distance', id: 'reconrmvvio_incorrect_dist', value: 1}
						]
					}]
				},{
					columnWidth: 1.00,
					layout: 'form',
					defaults: {
						width: this.defaultTextFieldWidthLong
					},
					labelAlign: 'top',
					items: [{
						xtype: 'textarea',
						id: 'rmv_misrep_notes_text',
						fieldLabel: 'Original Appraisal Integrity Review Comments (<span style="color: red; font-weight: bold;">DO NOT</span> use the words "value misrepresentation" in your comments)',
						anchor: '95%',
						validator: function(v) {
							if (v.length > 0) {
								return true;
							}

							//if (Ext.getCmp('rmv_misrep_violations_enum').getValue()=='Yes' && Ext.getCmp('origination_comments_section').isVisible() && v.length==0) {
							//	return false;
							//}

							if (Ext.getCmp('origination_comments_section').isVisible() && v.length < 1) {
								return false;
							}

							return true;
						}
					}]
				}]
			},{
				xtype: 'fieldset',
				layout: 'column',
				title: 'Ancillary Data',
				items: [
					{
						columnWidth: 1.00,
						layout: 'form',
						items: [{
							xtype: 'displayfield',
							hideLabel: true,
							style: 'margin-bottom: 3px',
							value: 'If your concluded value does not fall within the ancillary data value ranges, then a detailed explanation should be provided supporting this fact.'
						}]
					},{
						columnWidth: 0.50,
						layout: 'form',
						labelWidth: 175,
						defaults: {
							width: 90
						},
						items: [{
							xtype: 'dollarfield',
							id: 'rmv_anc_rq_saleprice_lowest',
							fieldLabel: '<span style="color:red;">*</span>RealQuest Lowest Price Sale',
							allowBlank: false,
							listeners: {
								change: {
									scope: this,
									fn:this.ancillaryDataChange
								},
								afterrender: {
									scope: this,
									fn: this.ancillaryDataChange
								}
							}
						},{
							xtype: 'dollarfield',
							id: 'rmv_anc_rq_saleprice_highest',
							fieldLabel: '<span style="color:red;">*</span>RealQuest Highest Price Sale',
							allowBlank: false,
							listeners: {
								change: {
									scope: this,
									fn:this.ancillaryDataChange
								},
								afterrender: {
									scope: this,
									fn: this.ancillaryDataChange
								}
							}
						}]
					},{
						columnWidth: 0.50,
						layout: 'form',
						labelWidth: 175,
						defaults: {
							width: 90
						},
						items: [{
							xtype: 'dollarfield',
							id: 'rmv_anc_hpro_saleprice_lowest',
							fieldLabel: 'ACRP Lowest Price Sale',
							allowBlank: true
						},{
							xtype: 'dollarfield',
							id: 'rmv_anc_hpro_saleprice_highest',
							fieldLabel: 'ACRP Highest Price Sale',
							allowBlank: true
						}]
					},
					{
						columnWidth: 1.00,
						layout: 'form',
						labelAlign: 'top',
						id: 'section_rmv_anc_bracketing_comment',
						items: [
							{
								html:"&nbsp;"
							},
							{
								xtype: 'textarea',
								id: 'rmv_anc_bracketing_comment',
								fieldLabel: 'If applicable, please comment on why your concluded value is not bracketed by RealQuest',
								allowBlank: true,
								anchor: '90%'
							}
						]
					}
				]
			},{
				xtype: 'fieldset',
				layout: 'column',
				title: 'Most Recent BPO/Appraisal',
				items: [{
					columnWidth: 0.50,
					layout: 'form',
					defaults: {
						width: this.defaultTextFieldWidthShort
					},
					items: [{
						xtype: 'datermv',
						id: 'rmv_bpo_review_date',
						fieldLabel: '<span style="color:red;">*</span>Date',
						allowBlank: false
					},{
						xtype: 'textfield',
						id: 'rmv_bpo_review_vendor_char',
						fieldLabel: '<span style="color:red;">*</span>Vendor',
						allowBlank: false
					},{
						id: 'rmv_bpo_review_access_enum',
						xtype: 'combo',
						fieldLabel: '<span style="color:red;">*</span>Type',
						allowBlank: false,
						store: new Ext.data.SimpleStore({
							fields: ['item'],
							data : [
								['BPO Exterior'],
								['BPO Interior'],
								['Appraisal Exterior'],
								['Appraisal Interior']
							]
						}),
						displayField:'item',
						valueField:'item',
						forceSelection: true,
						editable:true,
						triggerAction: 'all',
						mode: 'local',
						selectOnFocus:true
					},{
						id: 'rmv_bpo_review_assessment_enum',
						xtype: 'hidden',
						value: 'Unreliable'
					}]
				},{
					columnWidth: 0.50,
					layout: 'form',
					labelWidth: 165,
					defaults: {
						width: 125
					},
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_bpo_review_90_as_is_int',
						fieldLabel: '<span style="color:red;">*</span>90 As Is',
						allowBlank: false,
						listeners: {
							change: {
								scope:this,
								fn: function() {

									if (Ext.getCmp('form-recon-comments')) {
										Ext.getCmp('form-recon-comments').vVariance();
									}
									this.syncReadOnlySubjectData();
								}
							}
						}
					},{
						xtype: 'dollarfield',
						id: 'rmv_bpo_review_90_as_rep_int',
						fieldLabel: '<span style="color:red;">*</span>90 As Rep.',
						allowBlank: false
					},{
						xtype: 'dollarfield',
						id: 'rmv_bpo_review_fair_market_int',
						labelStyle: 'white-space:nowrap;',
						fieldLabel: '<span style="color:red;">*</span>Fair Market Value',
						allowBlank: false,
						listeners: {
							hide: function() {
								this.getEl().up('.x-form-item').setDisplayed(false);
							},
							show: function() {
								this.getEl().up('.x-form-item').setDisplayed(true);
							}
						}
					},{
						xtype: 'textfield',
						id: 'rmv_bpo_review_agent_appraiser_char',
						fieldLabel: '<span style="color:red;">*</span>Agent/Appraiser Name',
						allowBlank: false
					}]
				},{
					columnWidth: 1.00,
					xtype: 'fieldset',
					title: 'Choose Assessments',
					id: 'fs-chkgrp-assessment',
					bodyStyle: 'padding: 5px',
					labelAlign: 'top',
					items: [{
						id: 'chkgrp-assessment',
						xtype: 'checkboxgroup',
						allowBlank: true,
						hideLabel: true,
						columns: 2,
						items: [
							{ boxLabel: 'Breaches comp distance thresholds', id: 'reconrmvassmt_compdst', value: 1},
							{ boxLabel: 'Inappropriate repair considerations', id: 'reconrmvassmt_inapprrprcnsd', value: 1},
							{ boxLabel: 'Conclusion unsupported', id: 'reconrmvassmt_conclunspt', value: 1},
							{ boxLabel: 'Subject improvements inaccurate', id: 'reconrmvassmt_sjbimprinacr', value: 1},
							{ boxLabel: 'Inappropriate comps', id: 'reconrmvassmt_inapprcmps', value: 1},
							{ boxLabel: 'Subject market history inaccurate or absent', id: 'reconrmvassmt_sbjhstinacabs', value: 1},
							{ boxLabel: 'Dated comps', id: 'reconrmvassmt_dtdcmps', value: 1},
							{ boxLabel: 'Subject condition inaccurate', id: 'reconrmvassmt_sjbcndinac', value: 1},
							{ boxLabel: 'Inaccurate property type', id: 'reconrmvassmt_inacprptyp', value: 1},
							{ boxLabel: 'Inaccurate list/sales prices', id: 'reconrmvassmt_inaclstpr', value: 1},
							{ boxLabel: 'Incorrect/absent photos', id: 'reconrmvassmt_incabsphts', value: 1},
							{ boxLabel: 'Inadequate explanations', id: 'reconrmvassmt_inadexpl', value: 1},
							{ boxLabel: 'Subject site influences inaccurate', id: 'reconrmvassmt_sbjstinflinac', value: 1},
							{ boxLabel: 'Incorrect subject property', id: 'reconrmvassmt_incsbjprop', value: 1},
							{ boxLabel: 'Inadequate reporting of salient facts', id: 'reconrmvassmt_slsfacts', value: 1},
							{ boxLabel: 'Subject GLA inaccurate', id: 'reconrmvassmt_sjbglainac', value: 1}
						]
					},{
						xtype: 'checkbox',
						id: 'reconrmvassmt_nonegatives',
						hideLabel: true,
						value: 1,
						boxLabel: 'The BPO / Appraisal does not exhibit any of the above negative assessments',
						listeners: {
							check: function(cb, isChecked) {
								if (isChecked) {
									Ext.getCmp('rmv_bpo_review_assessment_enum').setValue('Reliable');
								} else {
									Ext.getCmp('rmv_bpo_review_assessment_enum').setValue('Unreliable');
								}

								Ext.getCmp('chkgrp-assessment').items.each(function(item, index, length) {
									//console.log(item.getValue());
									if (isChecked) {
										// clear out and disable all assessments
										item.setValue(false);
										item.disable();
									} else {
										item.enable();
									}
								});
							}
						}
					}]
				},{
					hidden: true,
					columnWidth: 1.00,
					layout: 'form',
					id: 'fm-oil-question-1',
					labelAlign: 'top',
					labelSeparator: '?',
					defaults: {
						width: this.defaultTextFieldWidthLong
					},
					items: [{
						id: 'combo_oil_question1',
						xtype: 'combormvyn',
						value: 'No',
						fieldLabel: "<span style=\"color:red;\">*</span>Has the agent appropriately addressed the subject's close proximity to the Gulf Oil Spill, and the impact, if any, it has on the subject and/or subject value"
					}]
				},{
					hidden: true,
					columnWidth: 1.00,
					layout: 'form',
					id: 'fm-oil-question-2',
					labelAlign: 'top',
					labelSeparator: '?',
					defaults: {
						width: this.defaultTextFieldWidthLong
					},
					items: [{
						id: 'combo_oil_question2',
						xtype: 'combormvyn',
						value: 'No',
						fieldLabel: "<span style=\"color:red;\">*</span>Based on the agent's comments in the report concerning the Gulf Oil Spill was it determined to have an unfavorable impact to the subject and/or the subject's value"
					}]
				},{
					columnWidth: 1.00,
					layout: 'form',
					labelAlign: 'top',
					items: [{
						xtype: 'textarea',
						anchor: '90%',
						id: 'rmv_bpo_review_notes',
						fieldLabel: '<span style="color:red;">*</span>Comments on Most Recent BPO/Appraisal <b>(You MUST include details of any identified negative assessments)</b>',
						allowBlank: false
					}]
				},{
					columnWidth: 1.00,
					layout: 'form',
					labelAlign: 'top',
					id: 'container_priorbpo_explanation',
					items: [{
						xtype: 'textarea',
						anchor: '90%',
						height: 40,
						id: 'rmv_bpo_review_comment_char',
						fieldLabel: '<span style="color:red;">*</span>Explanation of change in value from prior BPO',
						allowBlank: true
					}]
				},{
					columnWidth: 1.00,
					layout: 'form',
					labelAlign: 'top',
					id: 'container_priorbpo_apprwrpr',
					hidden: true,
					items: [{
						xtype: 'textarea',
						anchor: '90%',
						disabled: true,
						id: 'rmv_bpo_review_apprwrpr_text',
						fieldLabel: '<span style="color:red;">*</span>Appraisal Wrapper / GAAR / ACRP',
						allowBlank: true
					}]
				}]
			},{
				xtype: 'fieldset',
				layout: 'column',
				title: 'BPO/Appraisal 2',
				id: 'reconpriorbpo2',
				items: [{
					columnWidth: 0.50,
					layout: 'form',
					defaults: {
						width: this.defaultTextFieldWidthShort
					},
					items: [{
						xtype: 'datermv',
						id: 'reconpriorbpo2_review_date',
						fieldLabel: '<span style="color:red;">*</span>Date',
						allowBlank: true
					},{
						xtype: 'textfield',
						id: 'reconpriorbpo2_review_vendor_char',
						fieldLabel: '<span style="color:red;">*</span>Vendor',
						allowBlank: true
					},{
						id: 'reconpriorbpo2_review_access_enum',
						xtype: 'combo',
						fieldLabel: '<span style="color:red;">*</span>Int/Ext',
						allowBlank: true,
						store: new Ext.data.SimpleStore({
							fields: ['item'],
							data : [
								['Interior'],
								['Exterior']
							]
						}),
						displayField:'item',
						valueField:'item',
						forceSelection: true,
						editable:true,
						triggerAction: 'all',
						mode: 'local',
						selectOnFocus:true
					}]
				},{
					columnWidth: 0.50,
					layout: 'form',
					defaults: {
						width: this.defaultTextFieldWidthShort
					},
					items: [{
						xtype: 'dollarfield',
						id: 'reconpriorbpo2_review_90_as_is_int',
						fieldLabel: '<span style="color:red;">*</span>90 As Is',
						allowBlank: true
					},{
						xtype: 'dollarfield',
						id: 'reconpriorbpo2_review_90_as_rep_int',
						fieldLabel: '<span style="color:red;">*</span>90 As Rep.',
						allowBlank: true
					}]
				},{
					columnWidth: 1.00,
					layout: 'form',
					defaults: {
						width: this.defaultTextFieldWidthLong
					},
					items: [{
						id: 'reconpriorbpo2_review_assessment_enum',
						xtype: 'combo',
						fieldLabel: 'Assessment',
						store: new Ext.data.SimpleStore({
							fields: ['answer'],
							data : [
								['Reliable'],
								['Unreliable']
							]
						}),
						displayField:'answer',
						valueField:'answer',
						forceSelection: true,
						editable:true,
						triggerAction: 'all',
						mode: 'local',
						selectOnFocus:true,
						listeners: {
							select: function(o, r, i) {
								if(r.get('answer')=='Unreliable') {
									Ext.getCmp('fs-chkgrp-assessment-reconpriorbpo2').show();
									Ext.getCmp('chkgrp-assessment-reconpriorbpo2').enable();
									Ext.getCmp('chkgrp-assessment-reconpriorbpo2').allowBlank = false;
								} else {
									Ext.getCmp('chkgrp-assessment-reconpriorbpo2').allowBlank = true;
									Ext.getCmp('fs-chkgrp-assessment-reconpriorbpo2').hide();
									Ext.getCmp('chkgrp-assessment-reconpriorbpo2').disable();
								}
							}
						}
					}]
				},{
					columnWidth: 1.00,
					layout: 'form',
					id: 'fs-chkgrp-assessment-reconpriorbpo2',
					labelAlign: 'top',
					hidden: true,
					items: [{
						id: 'chkgrp-assessment-reconpriorbpo2',
						xtype: 'checkboxgroup',
						allowBlank: true,
						fieldLabel: 'Choose Assessments',
						columns: 2,
						items: [
							{ boxLabel: 'Comp distance', id: 'reconpriorbpo2_assmt_compdst', value: 1},
							{ boxLabel: 'Inappropriate repair considerations', id: 'reconpriorbpo2_assmt_inapprrprcnsd', value: 1},
							{ boxLabel: 'Conclusion unsupported', id: 'reconpriorbpo2_assmt_conclunspt', value: 1},
							{ boxLabel: 'Subject improvements inaccurate', id: 'reconpriorbpo2_assmt_sjbimprinacr', value: 1},
							{ boxLabel: 'Inappropriate comps', id: 'reconpriorbpo2_assmt_inapprcmps', value: 1},
							{ boxLabel: 'Subject market history inaccurate or absent', id: 'reconpriorbpo2_assmt_sbjhstinacabs', value: 1},
							{ boxLabel: 'Dated comps', id: 'reconpriorbpo2_assmt_dtdcmps', value: 1},
							{ boxLabel: 'Subject condition inaccurate', id: 'reconpriorbpo2_assmt_sjbcndinac', value: 1},
							{ boxLabel: 'Inaccurate property type', id: 'reconpriorbpo2_assmt_inacprptyp', value: 1},
							{ boxLabel: 'Inaccurate list/sales prices', id: 'reconpriorbpo2_assmt_inaclstpr', value: 1},
							{ boxLabel: 'Incorrect/absent photos', id: 'reconpriorbpo2_assmt_incabsphts', value: 1},
							{ boxLabel: 'Inadequate explanations', id: 'reconpriorbpo2_assmt_inadexpl', value: 1},
							{ boxLabel: 'Subject site influences inaccurate', id: 'reconpriorbpo2_assmt_sbjstinflinac', value: 1},
							{ boxLabel: 'Incorrect subject property', id: 'reconpriorbpo2_assmt_incsbjprop', value: 1},
							{ boxLabel: 'Inadequate reporting of salient facts', id: 'reconpriorbpo2_assmt_slsfacts', value: 1},
							{ boxLabel: 'Subject GLA inaccurate', id: 'reconpriorbpo2_assmt_sjbglainac', value: 1}
						]
					}]
				},{
					columnWidth: 1.00,
					layout: 'form',
					labelAlign: 'top',
					items: [{
						xtype: 'textarea',
						anchor: '90%',
						id: 'reconpriorbpo2_review_notes',
						fieldLabel: '<span style="color:red;">*</span>Comments on BPO/Appraisal 2',
						allowBlank: true
					}]
				}]
			},{
				xtype: 'fieldset',
				layout: 'column',
				title: 'BPO/Appraisal 3',
				id: 'reconpriorbpo3',
				items: [{
					columnWidth: 0.50,
					layout: 'form',
					defaults: {
						width: this.defaultTextFieldWidthShort
					},
					items: [{
						xtype: 'datermv',
						id: 'reconpriorbpo3_review_date',
						fieldLabel: '<span style="color:red;">*</span>Date',
						allowBlank: false
					},{
						xtype: 'textfield',
						id: 'reconpriorbpo3_review_vendor_char',
						fieldLabel: '<span style="color:red;">*</span>Vendor',
						allowBlank: false
					},{
						id: 'reconpriorbpo3_review_access_enum',
						xtype: 'combo',
						fieldLabel: '<span style="color:red;">*</span>Int/Ext',
						allowBlank: false,
						store: new Ext.data.SimpleStore({
							fields: ['item'],
							data : [
								['Interior'],
								['Exterior']
							]
						}),
						displayField:'item',
						valueField:'item',
						forceSelection: true,
						editable:true,
						triggerAction: 'all',
						mode: 'local',
						selectOnFocus:true
					}]
				},{
					columnWidth: 0.50,
					layout: 'form',
					defaults: {
						width: this.defaultTextFieldWidthShort
					},
					items: [{
						xtype: 'dollarfield',
						id: 'reconpriorbpo3_review_90_as_is_int',
						fieldLabel: '<span style="color:red;">*</span>90 As Is',
						allowBlank: false
					},{
						xtype: 'dollarfield',
						id: 'reconpriorbpo3_review_90_as_rep_int',
						fieldLabel: '<span style="color:red;">*</span>90 As Rep.',
						allowBlank: false
					}]
				},{
					columnWidth: 1.00,
					layout: 'form',
					defaults: {
						width: this.defaultTextFieldWidthLong
					},
					items: [{
						id: 'reconpriorbpo3_review_assessment_enum',
						xtype: 'combo',
						fieldLabel: 'Assessment',
						store: new Ext.data.SimpleStore({
							fields: ['answer'],
							data : [
								['Reliable'],
								['Unreliable']
							]
						}),
						displayField:'answer',
						valueField:'answer',
						forceSelection: true,
						editable:true,
						triggerAction: 'all',
						mode: 'local',
						selectOnFocus:true,
						listeners: {
							select: function(o, r, i) {
								if(r.get('answer')=='Unreliable') {
									Ext.getCmp('fs-chkgrp-assessment-reconpriorbpo3').show();
									Ext.getCmp('chkgrp-assessment-reconpriorbpo3').enable();
									Ext.getCmp('chkgrp-assessment-reconpriorbpo3').allowBlank = false;
								} else {
									Ext.getCmp('chkgrp-assessment-reconpriorbpo3').allowBlank = true;
									Ext.getCmp('fs-chkgrp-assessment-reconpriorbpo3').hide();
									Ext.getCmp('chkgrp-assessment-reconpriorbpo3').disable();
								}
							}
						}
					}]
				},{
					columnWidth: 1.00,
					layout: 'form',
					id: 'fs-chkgrp-assessment-reconpriorbpo3',
					labelAlign: 'top',
					hidden: true,
					items: [{
						id: 'chkgrp-assessment-reconpriorbpo3',
						xtype: 'checkboxgroup',
						allowBlank: true,
						fieldLabel: 'Choose Assessments',
						columns: 2,
						items: [
							{ boxLabel: 'Comp distance', id: 'reconpriorbpo3_assmt_compdst', value: 1},
							{ boxLabel: 'Inappropriate repair considerations', id: 'reconpriorbpo3_assmt_inapprrprcnsd', value: 1},
							{ boxLabel: 'Conclusion unsupported', id: 'reconpriorbpo3_assmt_conclunspt', value: 1},
							{ boxLabel: 'Subject improvements inaccurate', id: 'reconpriorbpo3_assmt_sjbimprinacr', value: 1},
							{ boxLabel: 'Inappropriate comps', id: 'reconpriorbpo3_assmt_inapprcmps', value: 1},
							{ boxLabel: 'Subject market history inaccurate or absent', id: 'reconpriorbpo3_assmt_sbjhstinacabs', value: 1},
							{ boxLabel: 'Dated comps', id: 'reconpriorbpo3_assmt_dtdcmps', value: 1},
							{ boxLabel: 'Subject condition inaccurate', id: 'reconpriorbpo3_assmt_sjbcndinac', value: 1},
							{ boxLabel: 'Inaccurate property type', id: 'reconpriorbpo3_assmt_inacprptyp', value: 1},
							{ boxLabel: 'Inaccurate list/sales prices', id: 'reconpriorbpo3_assmt_inaclstpr', value: 1},
							{ boxLabel: 'Incorrect/absent photos', id: 'reconpriorbpo3_assmt_incabsphts', value: 1},
							{ boxLabel: 'Inadequate explanations', id: 'reconpriorbpo3_assmt_inadexpl', value: 1},
							{ boxLabel: 'Subject site influences inaccurate', id: 'reconpriorbpo3_assmt_sbjstinflinac', value: 1},
							{ boxLabel: 'Incorrect subject property', id: 'reconpriorbpo3_assmt_incsbjprop', value: 1},
							{ boxLabel: 'Inadequate reporting of salient facts', id: 'reconpriorbpo3_assmt_slsfacts', value: 1},
							{ boxLabel: 'Subject GLA inaccurate', id: 'reconpriorbpo3_assmt_sjbglainac', value: 1}
						]
					}]
				},{
					columnWidth: 1.00,
					layout: 'form',
					labelAlign: 'top',
					items: [{
						xtype: 'textarea',
						anchor: '90%',
						id: 'reconpriorbpo3_review_notes',
						fieldLabel: '<span style="color:red;">*</span>Comments on BPO/Appraisal 3',
						allowBlank: false
					}]
				}]
			},{
				xtype: 'fieldset',
				layout: 'column',
				title: 'BPO/Appraisal 4',
				id: 'reconpriorbpo4',
				items: [{
					columnWidth: 0.50,
					layout: 'form',
					defaults: {
						width: this.defaultTextFieldWidthShort
					},
					items: [{
						xtype: 'datermv',
						id: 'reconpriorbpo4_review_date',
						fieldLabel: '<span style="color:red;">*</span>Date',
						allowBlank: false
					},{
						xtype: 'textfield',
						id: 'reconpriorbpo4_review_vendor_char',
						fieldLabel: '<span style="color:red;">*</span>Vendor',
						allowBlank: false
					},{
						id: 'reconpriorbpo4_review_access_enum',
						xtype: 'combo',
						fieldLabel: '<span style="color:red;">*</span>Int/Ext',
						allowBlank: false,
						store: new Ext.data.SimpleStore({
							fields: ['item'],
							data : [
								['Interior'],
								['Exterior']
							]
						}),
						displayField:'item',
						valueField:'item',
						forceSelection: true,
						editable:true,
						triggerAction: 'all',
						mode: 'local',
						selectOnFocus:true
					}]
				},{
					columnWidth: 0.50,
					layout: 'form',
					defaults: {
						width: this.defaultTextFieldWidthShort
					},
					items: [{
						xtype: 'dollarfield',
						id: 'reconpriorbpo4_review_90_as_is_int',
						fieldLabel: '<span style="color:red;">*</span>90 As Is',
						allowBlank: false
					},{
						xtype: 'dollarfield',
						id: 'reconpriorbpo4_review_90_as_rep_int',
						fieldLabel: '<span style="color:red;">*</span>90 As Rep.',
						allowBlank: false
					}]
				},{
					columnWidth: 1.00,
					layout: 'form',
					defaults: {
						width: this.defaultTextFieldWidthLong
					},
					items: [{
						id: 'reconpriorbpo4_review_assessment_enum',
						xtype: 'combo',
						fieldLabel: 'Assessment',
						store: new Ext.data.SimpleStore({
							fields: ['answer'],
							data : [
								['Reliable'],
								['Unreliable']
							]
						}),
						displayField:'answer',
						valueField:'answer',
						forceSelection: true,
						editable:true,
						triggerAction: 'all',
						mode: 'local',
						selectOnFocus:true,
						listeners: {
							select: function(o, r, i) {
								if(r.get('answer')=='Unreliable') {
									Ext.getCmp('fs-chkgrp-assessment-reconpriorbpo4').show();
									Ext.getCmp('chkgrp-assessment-reconpriorbpo4').enable();
									Ext.getCmp('chkgrp-assessment-reconpriorbpo4').allowBlank = false;
								} else {
									Ext.getCmp('chkgrp-assessment-reconpriorbpo4').allowBlank = true;
									Ext.getCmp('fs-chkgrp-assessment-reconpriorbpo4').hide();
									Ext.getCmp('chkgrp-assessment-reconpriorbpo4').disable();
								}
							}
						}
					}]
				},{
					columnWidth: 1.00,
					layout: 'form',
					id: 'fs-chkgrp-assessment-reconpriorbpo4',
					labelAlign: 'top',
					hidden: true,
					items: [{
						id: 'chkgrp-assessment-reconpriorbpo4',
						xtype: 'checkboxgroup',
						allowBlank: true,
						fieldLabel: 'Choose Assessments',
						columns: 2,
						items: [
							{ boxLabel: 'Comp distance', id: 'reconpriorbpo4_assmt_compdst', value: 1},
							{ boxLabel: 'Inappropriate repair considerations', id: 'reconpriorbpo4_assmt_inapprrprcnsd', value: 1},
							{ boxLabel: 'Conclusion unsupported', id: 'reconpriorbpo4_assmt_conclunspt', value: 1},
							{ boxLabel: 'Subject improvements inaccurate', id: 'reconpriorbpo4_assmt_sjbimprinacr', value: 1},
							{ boxLabel: 'Inappropriate comps', id: 'reconpriorbpo4_assmt_inapprcmps', value: 1},
							{ boxLabel: 'Subject market history inaccurate or absent', id: 'reconpriorbpo4_assmt_sbjhstinacabs', value: 1},
							{ boxLabel: 'Dated comps', id: 'reconpriorbpo4_assmt_dtdcmps', value: 1},
							{ boxLabel: 'Subject condition inaccurate', id: 'reconpriorbpo4_assmt_sjbcndinac', value: 1},
							{ boxLabel: 'Inaccurate property type', id: 'reconpriorbpo4_assmt_inacprptyp', value: 1},
							{ boxLabel: 'Inaccurate list/sales prices', id: 'reconpriorbpo4_assmt_inaclstpr', value: 1},
							{ boxLabel: 'Incorrect/absent photos', id: 'reconpriorbpo4_assmt_incabsphts', value: 1},
							{ boxLabel: 'Inadequate explanations', id: 'reconpriorbpo4_assmt_inadexpl', value: 1},
							{ boxLabel: 'Subject site influences inaccurate', id: 'reconpriorbpo4_assmt_sbjstinflinac', value: 1},
							{ boxLabel: 'Incorrect subject property', id: 'reconpriorbpo4_assmt_incsbjprop', value: 1},
							{ boxLabel: 'Inadequate reporting of salient facts', id: 'reconpriorbpo4_assmt_slsfacts', value: 1},
							{ boxLabel: 'Subject GLA inaccurate', id: 'reconpriorbpo4_assmt_sjbglainac', value: 1}
						]
					}]
				},{
					columnWidth: 1.00,
					layout: 'form',
					labelAlign: 'top',
					items: [{
						xtype: 'textarea',
						anchor: '90%',
						id: 'reconpriorbpo4_review_notes',
						fieldLabel: '<span style="color:red;">*</span>Comments on BPO/Appraisal 4',
						allowBlank: false
					}]
				}]
			},{
				xtype: 'fieldset',
				layout: 'column',
				title: 'Property Details',
				items: [
					{
						columnWidth: 0.495,
						layout: 'form',
						items: [{
							xtype: 'fieldset',
							layout:'column',
							title: '<span style="color:#000;font-weight:normal;">Property Attributes</span>',
							items:[
								{
									columnWidth:1.0,
									layout:'form',
									items:[
										{
											id: 'combo_rmv_src_prop_attributes_varchar',
											xtype: 'combo',
											fieldLabel: '<span style="color:red;">*</span> Data Source',
											allowBlank: false,
											store: new Ext.data.SimpleStore({
												fields: ['value', 'display'],
												data : [
													['OA',                  'Origination Appraisal'],
													['Current Valuation',   'Current Valuation'],
													['Google',              'Ancillary Data - Google'],
													['Trulia',              'Ancillary Data - Trulia'],
													['RealQuest',           'Ancillary Data - RealQuest'],
													['HistoryPro',          'Ancillary Data - HistoryPro'],
													['Realtor.com',         'Ancillary Data - Realtor.com'],
													['Sitex',               'Ancillary Data - Sitex']
												]
											}),
											displayField:'display',
											valueField:'value',
											hiddenName: 'rmv_src_prop_attributes_varchar',
											forceSelection: true,
											editable:true,
											triggerAction: 'all',
											mode: 'local',
											selectOnFocus:true

										},
										{
											id: 'rmv_prop_type_enum',
											xtype: 'combo',
											fieldLabel: '<span style="color:red;">*</span>Type',
											allowBlank: false,
											store: new Ext.data.SimpleStore({
												fields: ['type'],
												data : [
													['Single Family'],
													['Condominium'],
													['Townhouse'],
													['2 Family'],
													['3 Family'],
													['4 Family'],
													['Commercial'],
													['Co-Op'],
													['Land Only'],
													['Manufactured Housing'],
													['Mixed Use'],
													['Mobile Home / Land Attached'],
													['Mobile Home / Only'],
													['Multi-Family'],
													['Other']
												]
											}),
											displayField:'type',
											valueField:'type',
											forceSelection: true,
											editable:true,
											triggerAction: 'all',
											mode: 'local',
											selectOnFocus:true
										},
										{
											id: 'rmv_prop_units_int',
											xtype: 'combo',
											fieldLabel: '<span style="color:red;">*</span>Unit(s)',
											allowBlank: false,
											store: new Ext.data.SimpleStore({
												fields: ['item'],
												data : [
													['1'],
													['2'],
													['3'],
													['4'],
													['5']
												]
											}),
											displayField:'item',
											valueField:'item',
											forceSelection: false,
											editable:true,
											triggerAction: 'all',
											mode: 'local',
											selectOnFocus:true
										},
										{
											xtype: 'numberfield',
											id: 'rmv_prop_age_int',
											fieldLabel: '<span style="color:red;">*</span>Age',
											allowBlank: false
										},
										{
											xtype: 'textfield',
											id: 'rmv_prop_sq_feet_float',
											allowBlank: false,
											fieldLabel: '<span style="color:red;">*</span>GLA'
										},
										{
											id: 'rmv_prop_num_floors_int',
											xtype: 'combo',
											fieldLabel: '<span style="color:red;">*</span>Floor(s)',
											allowBlank: false,
											store: new Ext.data.SimpleStore({
												fields: ['item'],
												data : [
													['1'],
													['1.5'],
													['2'],
													['2.5'],
													['3'],
													['3.5'],
													['4'],
													['4.5'],
													['5']
												]
											}),
											displayField:'item',
											valueField:'item',
											forceSelection: false,
											editable:true,
											triggerAction: 'all',
											mode: 'local',
											selectOnFocus:true
										},
										{
											xtype: 'numberfield',
											id: 'rmv_prop_num_rooms_int',
											allowBlank: false,
											fieldLabel: '<span style="color:red;">*</span>Rooms(s)',
											listeners: {
												change: this.syncReadOnlySubjectData
											}
										},
										{
											id: 'rmv_prop_num_bedrooms_int',
											xtype: 'combormvbeds',
											fieldLabel: '<span style="color:red;">*</span>Bedrooms',
											listeners: {
												change: this.syncReadOnlySubjectData
											},
											allowBlank: false
										},
										{
											id: 'rmv_prop_num_baths_decimal',
											xtype: 'combormvbaths',
											fieldLabel: '<span style="color:red;">*</span>Baths',
											listeners: {
												change: this.syncReadOnlySubjectData
											},
											allowBlank: false
										},
										{
											id: 'rmv_prop_num_fireplaces_int',
											xtype: 'combo',
											fieldLabel: '<span style="color:red;">*</span>Fireplace',
											allowBlank: false,
											store: new Ext.data.SimpleStore({
												fields: ['yn'],
												data : [
													['0'],
													['1'],
													['2'],
													['3'],
													['4'],
													['5']
												]
											}),
											displayField:'yn',
											valueField:'yn',
											forceSelection: true,
											editable:true,
											triggerAction: 'all',
											mode: 'local',
											selectOnFocus:true
										},
										{
											id: 'rmv_prop_garage_size_enum',
											xtype: 'combo',
											fieldLabel: '<span style="color:red;">*</span>Garage',
											allowBlank: false,
											store: new Ext.data.SimpleStore({
												fields: ['value'],
												data : [
													['1 car'],
													['2 car'],
													['3 car'],
													['4 car'],
													['5 car'],
													['Carport'],
													['No'],
													['Other']
												]
											}),
											displayField:'value',
											valueField:'value',
											forceSelection: true,
											editable:true,
											triggerAction: 'all',
											mode: 'local',
											selectOnFocus:true
										},
										{
											id: 'rmv_prop_basement_enum',
											xtype: 'combo',
											fieldLabel: '<span style="color:red;">*</span>Basement',
											allowBlank: false,
											store: new Ext.data.SimpleStore({
												fields: ['item'],
												data : [
													['Full'],
													['No'],
													['Partial'],
													['Yes']
												]
											}),
											displayField:'item',
											valueField:'item',
											forceSelection: false,
											editable:true,
											triggerAction: 'all',
											mode: 'local',
											selectOnFocus:true
										},
										{
											id: 'rmv_prop_pool_enum',
											xtype: 'combo',
											fieldLabel: '<span style="color:red;">*</span>Pool',
											store: new Ext.data.SimpleStore({
												fields: ['item'],
												data : [
													['Above Ground'],
													['In Ground'],
													['No']
												]
											}),
											displayField:'item',
											valueField:'item',
											forceSelection: true,
											editable:true,
											triggerAction: 'all',
											mode: 'local',
											selectOnFocus:true,
											allowBlank: false
										},
										{
											id: 'rmv_prop_style_enum',
											xtype: 'combo',
											fieldLabel: '<span style="color:red;">*</span>Style',
											allowBlank: false,
											store: new Ext.data.SimpleStore({
												fields: ['style'],
												data : [
													['1 Story'],
													['1 Story Condo Flat'],
													['1-1/2 story'],
													['2 Story'],
													['2-1/2 Story'],
													['3 Story'],
													['3-1/2 Story'],
													['4 Story'],
													['Bi-Level'],
													['Day Care'],
													['Flex Space'],
													['Geodesic Dome'],
													['Land Only'],
													['Manufactured Mobile Double Wide'],
													['Manufactured Mobile Single Wide'],
													['Manufacturing Plant'],
													['Modular Manufactured Home'],
													['Nursing Home/Assisted Living'],
													['Office: 1-4 Residential Units'],
													['Office: More than 4 Residential Units'],
													['Office: Retail and Residential'],
													['Other - Describe in comments'],
													['Row Home'],
													['Row Home-End'],
													['Split-Level'],
													['Store Front: 1-4 Residential Units'],
													['Store Front: More than 4 Residential Units'],
													['Store Front: Retail'],
													['Strip Center'],
													['Townhouse'],
													['Townhouse-End'],
													['Twin (Semi-Detached)'],
													['Warehouse'],
													['Working farm']
												]
											}),
											displayField:'style',
											valueField:'style',
											forceSelection: true,
											editable:true,
											triggerAction: 'all',
											mode: 'local',
											selectOnFocus:true
										},
										{
											xtype: 'textfield',
											id: 'rmv_prop_lot_size_float',
											allowBlank: false,
											fieldLabel: '<span style="color:red;">*</span>Lot Size',
											listeners: {
												change: this.syncReadOnlySubjectData
											}
										},
										{
											id: 'rmv_prop_location_enum',
											xtype: 'combo',
											allowBlank: false,
											fieldLabel: '<span style="color:red;">*</span>Location',
											store: new Ext.data.SimpleStore({
												fields: ['value'],
												data : [
													['Urban'],
													['Suburban'],
													['Rural']
												]
											}),
											displayField:'value',
											valueField:'value',
											forceSelection: true,
											editable:true,
											triggerAction: 'all',
											mode: 'local',
											selectOnFocus:true
										}
									]
								}
							]
						}]
					},
					{
						columnWidth:0.01,
						layout:'form',
						items:{
							html:"&nbsp;"
						}
					},
					{
						columnWidth:0.495,
						layout: 'form',
						items:[
							{
								xtype:'fieldset',
								layout:'column',
								title:'<span style="color:#000;font-weight:normal;">Market Data/Conditions</span>',
								items:[
									{
										columnWidth: 1.0,
										layout: 'form',
										items:[
											{
												id: 'combo_rmv_src_market_data_varchar',
												xtype: 'combo',
												fieldLabel: '<span style="color:red;">*</span> Data Source',
												allowBlank: false,
												store: new Ext.data.SimpleStore({
													fields: ['value', 'display'],
													data : [
														['Current Valuation',   'Current Valuation'],
														['Google.com',          'Ancillary Data - Google'],
														['Trulia.com',          'Ancillary Data - Trulia'],
														['RealQuest',           'Ancillary Data - RealQuest'],
														['History Pro',         'Ancillary Data - HistoryPro'],
														['Realtor.com',         'Ancillary Data - Realtor.com'],
														['Sitex',               'Ancillary Data - Sitex']
													]
												}),
												displayField:'display',
												valueField:'value',
												hiddenName:'rmv_src_market_data_varchar',
												forceSelection: true,
												editable:true,
												triggerAction: 'all',
												mode: 'local',
												selectOnFocus:true
											},
											{
												id: 'rmv_prop_area_built_enum',
												xtype: 'combo',
												fieldLabel: '<span style="color:red;">*</span>Area Built',
												allowBlank: false,
												store: new Ext.data.SimpleStore({
													fields: ['value'],
													data : [
														['Under 25%'],
														['25% to 75%'],
														['Over 75%']
													]
												}),
												displayField:'value',
												valueField:'value',
												forceSelection: true,
												editable:true,
												triggerAction: 'all',
												mode: 'local',
												selectOnFocus:true
											},
											{
												id: 'rmv_prop_growth_rate_enum',
												xtype: 'combo',
												allowBlank: false,
												fieldLabel: '<span style="color:red;">*</span>Growth Rate',
												store: new Ext.data.SimpleStore({
													fields: ['value'],
													data : [
														['Rapid'],
														['Stable'],
														['Slow']
													]
												}),
												displayField:'value',
												valueField:'value',
												forceSelection: true,
												editable:true,
												triggerAction: 'all',
												mode: 'local',
												selectOnFocus:true
											},
											{
												id: 'rmv_prop_local_economy_enum',
												xtype: 'combo',
												allowBlank: false,
												fieldLabel: '<span style="color:red;">*</span>Local Economy',
												store: new Ext.data.SimpleStore({
													fields: ['value'],
													data : [
														['Improving'],
														['Stable'],
														['Declining']
													]
												}),
												displayField:'value',
												valueField:'value',
												forceSelection: true,
												editable:true,
												triggerAction: 'all',
												mode: 'local',
												selectOnFocus:true
											},
											{
												id: 'rmv_prop_property_values_enum',
												xtype: 'combo',
												fieldLabel: '<span style="color:red;">*</span>Property Values',
												allowBlank: false,
												store: new Ext.data.SimpleStore({
													fields: ['item'],
													data : [
														['Increasing'],
														['Stable'],
														['Declining']
													]
												}),
												displayField:'item',
												valueField:'item',
												forceSelection: false,
												editable:true,
												triggerAction: 'all',
												mode: 'local',
												selectOnFocus:true
											},
											{
												xtype: 'combo',
												allowBlank: false,
												id: 'rmv_prop_days_on_market_enum',
												fieldLabel: '<span style="color:red;">*</span>Days on Market',
												store: new Ext.data.SimpleStore({
													fields: ['item'],
													data : [
														['Less than 90'],
														['90 - 120'],
														['Greater 120']
													]
												}),
												displayField:'item',
												valueField:'item',
												forceSelection: true,
												editable: false,
												triggerAction: 'all',
												mode: 'local',
												selectOnFocus:true,
												listeners:{
													change: this.syncReadOnlySubjectData
												}
											},
											{
												id: 'rmv_prop_supply_enum',
												xtype: 'combo',
												fieldLabel: '<span style="color:red;">*</span>Supply',
												allowBlank: false,
												store: new Ext.data.SimpleStore({
													fields: ['value'],
													data : [
														['In Balance'],
														['Over Supply'],
														['Shortage']
													]
												}),
												displayField:'value',
												valueField:'value',
												forceSelection: true,
												editable:true,
												triggerAction: 'all',
												mode: 'local',
												selectOnFocus:true
											},
											{
												id: 'rmv_prop_vandalism_enum',
												xtype: 'combo',
												fieldLabel: '<span style="color:red;">*</span>Vandalism',
												allowBlank: false,
												store: new Ext.data.SimpleStore({
													fields: ['item'],
													data : [
														['High'],
														['Medium'],
														['Low']
													]
												}),
												displayField:'item',
												valueField:'item',
												forceSelection: true,
												editable:true,
												triggerAction: 'all',
												mode: 'local',
												selectOnFocus:true
											}
										]
								}]
							},
							/*{
								html:'<div style="padding: 9px 0 8px 0">&nbsp;</div>'
							},*/
							{
								xtype:'fieldset',
								layout:'column',
								title:'<span style="color:#000;font-weight:normal;">Other Information</span>',
								items:[
									{
										columnWidth: 1.0,
										layout: 'form',
										items:[
											{
												id: 'rmv_prop_condition_enum',
												xtype: 'combo',
												fieldLabel: '<span style="color:red;">*</span>Condition',
												allowBlank: false,
												store: new Ext.data.SimpleStore({
													fields: ['condition'],
													data : [
														['Excellent'],
														['Good'],
														['Average'],
														['Fair'],
														['Poor']
													]
												}),
												displayField:'condition',
												valueField:'condition',
												forceSelection: true,
												editable:true,
												triggerAction: 'all',
												mode: 'local',
												selectOnFocus:true,
												listeners: {
													change: this.syncReadOnlySubjectData
												}
											},
											{
												id: 'rmv_prop_zoning_enum',
												xtype: 'combo',
												fieldLabel: '<span style="color:red;">*</span>Zoning',
												allowBlank: false,
												store: new Ext.data.SimpleStore({
													fields: ['item'],
													data : [
														['Residential'],
														['Commercial'],
														['Rural'],
														['Agricultural'],
														['None'],
														['Unknown']
													]
												}),
												displayField:'item',
												valueField:'item',
												forceSelection: false,
												editable:true,
												triggerAction: 'all',
												mode: 'local',
												selectOnFocus:true
											},
											{
												id: 'rmv_prop_occupancy_char',
												xtype: 'combo',
												fieldLabel: '<span style="color:red;">*</span>Occupancy',
												allowBlank: false,
												store: new Ext.data.SimpleStore({
													fields: ['item'],
													data : [
														['Occupied'],
														['Vacant'],
														['Unknown']
													]
												}),
												displayField:'item',
												valueField:'item',
												forceSelection: true,
												editable:true,
												triggerAction: 'all',
												mode: 'local',
												selectOnFocus:true
											},
											{
												id: 'rmv_prop_defmaint_char',
												xtype: 'combo',
												fieldLabel: '<span style="color:red;">*</span>Deferred Maint.',
												allowBlank: false,
												store: new Ext.data.SimpleStore({
													fields: ['item'],
													data : [
														['Yes'],
														['No']
													]
												}),
												displayField:'item',
												valueField:'item',
												forceSelection: true,
												editable:true,
												triggerAction: 'all',
												mode: 'local',
												selectOnFocus:true
											},
											{
												id: 'rmv_prop_problem_char',
												xtype: 'combo',
												fieldLabel: '<span style="color:red;">*</span>Problem Prop.',
												allowBlank: false,
												store: new Ext.data.SimpleStore({
													fields: ['item'],
													data : [
														['Yes'],
														['No']
													]
												}),
												displayField:'item',
												valueField:'item',
												forceSelection: true,
												editable:true,
												triggerAction: 'all',
												mode: 'local',
												selectOnFocus:true
											},
											{
												id: 'combo_rmv_prop_view_varchar',
												xtype: 'combo',
												hidden: true,
												hideLabel: true,
												//fieldLabel: '<span style="color:red;">*</span>External Factors',
												allowBlank: true,
												store: new Ext.data.SimpleStore({
													fields: ['value', 'display'],
													data : [
														['power lines',             'View - Power lines'],
														['highways',                'View - Highway'],
														['railroads',               'View - Railroad'],
														['commercial properties',   'View - Commercial'],
														['busy roads',              'View - Busy road'],
														['environmental hazards',   'Environmental hazards'],
														['mountain view',           'View - Mountain'],
														['skyline view',            'View - Skyline'],
														['golf course view',        'View - Golf course'],
														['water view',              'View - Water'],
														['waterfront',              'Waterfront'],
														['golf course',             'On Golf Course'],
														['None',                    'None']
													]
												}),
												displayField:'display',
												valueField:'value',
												hiddenName:'rmv_prop_view_varchar',
												forceSelection: true,
												editable:true,
												triggerAction: 'all',
												mode: 'local',
												selectOnFocus:true
											}
										]
									}
								]
							}
						]
					},
					{
						columnWidth:1.0,
						layout: 'form',
						items:[
							{
								xtype:'fieldset',
								layout:'column',
								title:'<span style="color:#000;font-weight:normal;">Current Listing Information</span>',
								items:
									[
										{

											columnWidth: 0.45,
											layout: 'form',
											labelWidth:150,
											items:[
												{
													id: 'rmv_currently_listed_char',
													xtype: 'combo',
													width: 75,
													fieldLabel: '<span style="color:red;">*</span> Currently Listed?',
													allowBlank: false,
													store: new Ext.data.SimpleStore({
														fields: ['item'],
														data : [
															['Yes'],
															['No']
														]
													}),
													displayField:'item',
													valueField:'item',
													forceSelection: true,
													editable:true,
													triggerAction: 'all',
													mode: 'local',
													selectOnFocus:true,
													listeners: {
														collapse: this.currentlyListed,
														change: this.currentlyListed
													}
												},
												{
													html: '&nbsp;'
												}
											]
										},
										{
											columnWidth: 0.55,
											layout: 'form',
											id:'_col_current_list_date_and_price',
											labelWidth: 150,
											items:[
												{
													xtype: 'datermv',
													id: 'rmv_current_listing_date',
													fieldLabel: '<span style="color:red;">*</span> Current List Date',
													allowBlank: false
												},
												{
													xtype: 'dollarfield',
													id: 'rmv_current_list_price_int',
													fieldLabel: '<span style="color:red;">*</span> Current List Price',
													allowBlank: false,
													width:100
												}
											]
										},
										{
											columnWidth: 1.00,
											id:'_col_current_listing_reasonable_source',
											labelWidth: 220,
											layout: 'form',
											items: [{
												id: 'combo_rmv_current_list_reasonableness_varchar',
												xtype: 'combo',
												fieldLabel: '<span style="color:red;">*</span> Reasonableness of List Price',
												allowBlank: false,
												width: 270,
												store: new Ext.data.SimpleStore({
													fields: ['value', 'display'],
													data : [
														['priced below the current market',      'Priced Below Market for Quick Sale'],
														['priced appropriately at market value', 'Priced Appropriately at Market Value'],
														['overpriced for the current market',    'Overpriced Based on Market Data Reviewed']
													]
												}),
												displayField:'display',
												valueField:'value',
												hiddenName: 'rmv_current_list_reasonableness_varchar',
												forceSelection: true,
												editable:true,
												triggerAction: 'all',
												mode: 'local',
												selectOnFocus:true
											},
											{
												id: 'rmv_current_list_src_varchar',
												xtype: 'combo',
												fieldLabel: '<span style="color:red;">*</span> Source of Current Listing',
												allowBlank: false,
												width: 270,
												store: new Ext.data.SimpleStore({
													fields: ['value'],
													data : [
														['Realtor.com'],
														['Trulia.com'],
														['Google.com']
													]
												}),
												displayField:'value',
												valueField:'value',
												forceSelection: true,
												editable:true,
												triggerAction: 'all',
												mode: 'local',
												selectOnFocus:true
											}
										]
									}
									]
							},
							{
								columnWidth: 1.00,
								layout: 'form',
								labelAlign: 'top',
								items: [{
									xtype: 'textarea',
									anchor: '95%',
									id: 'rmv_prop_notes_text',
									allowBlank: false,
									fieldLabel: '<span style="color:red;">*</span>Comments on subject property, market, and neighborhood'
								}]
							}
						]
					}
				]
			},{
				xtype: 'fieldset',
				layout: 'column',
				id: 'fs_realquest_pro',
				title: 'RealQuest Pro Search Criteria',
				items: [{
					columnWidth: 1.00,
					layout: 'form',
					items: [{
						xtype: 'textarea',
						anchor: '90%',
						id: 'rqpro_criteria_text',
						hideLabel: true,
						allowBlank: true
					}]
				}]
			},{
				xtype: 'fieldset',
				layout: 'column',
				title: 'Comparable Evaluations',
				items: [
				{
					columnWidth: this.layoutConfig.compEval.standard.width[0] +
								 this.layoutConfig.compEval.standard.width[1],
					layout: 'form',
					items: [{
						xtype: 'panel',
						html: '&nbsp;'
					}]
				},{
					columnWidth: this.layoutConfig.compEval.standard.width[2],
					layout: 'form',
					style: 'padding: 0 0 4px 20px',
					items: [{
						xtype: 'button',
						text: 'Reset This Comp',
						scope: this,
						handler: function() {
							this.clearComp(2);
						}
					}]
				},{
					columnWidth: this.layoutConfig.compEval.standard.width[3],
					layout: 'form',
					style: 'padding: 0 0 4px 20px',
					items: [{
						xtype: 'button',
						text: 'Reset This Comp',
						scope: this,
						handler: function() {
							this.clearComp(3);
						}
					}]
				},{
					// NEW ROW
					columnWidth: 1.00,
					layout: 'form',
					bodyStyle: 'clear: both;'
				},{

					// Subject Column
					columnWidth: this.layoutConfig.compEval.standard.width[0],
					layout: 'form',
					defaults: {
						width: "50%",
						labelStyle: "width:50%"
					},
					hidden: this.layoutConfig.compEval.standard.hideSubject,
					items: [
						{
							xtype: 'textfield',
							id: '_sbj_label',
							fieldLabel: 'Comp Source',
							value: "Subject (Read Only)",
							width: this.layoutConfig.compEval.standard.subject.text,
							readOnly: true
						},{
							xtype: 'textfield',
							id: '_sbj_type_enum',
							fieldLabel: 'Comp Type',
							value:"",
							width: this.layoutConfig.compEval.standard.subject.text,
							readOnly: true,
							disabled:true
						},{
							xtype: 'textfield',
							id: '_sbj_recon_value_type_enum',
							fieldLabel: 'Recent Valuation Type',
							width: this.layoutConfig.compEval.standard.subject.text,
							readOnly: true,
							disabled:true
						},{
							xtype: 'dollarfield',
							id: '_sbj_comp_value_int',
							fieldLabel: 'Comp Val.',
							width: this.layoutConfig.compEval.standard.subject.dollar,
							readOnly: true
						},{
							xtype: 'textfield',
							id: '_sbj_address1_char',
							fieldLabel: 'Street Address',
							width: this.layoutConfig.compEval.standard.subject.text,
							readOnly: true
						},{
							xtype: 'textfield',
							id: '_sbj_city_char',
							fieldLabel: 'City',
							width: this.layoutConfig.compEval.standard.subject.text,
							readOnly: true
						},{
							xtype: 'textfield',
							id: '_sbj_state_char',
							fieldLabel: 'State',
							width: this.layoutConfig.compEval.standard.subject.text,
							readOnly: true
						},{
							xtype: 'textfield',
							id: '_sbj_zip_char',
							fieldLabel: 'Zip',
							width: this.layoutConfig.compEval.standard.subject.text,
							readOnly: true
						},{
							xtype: 'textfield',
							id: '_sbj_sbjdst_char',
							fieldLabel: 'Distance to Subject',
							width: this.layoutConfig.compEval.standard.subject.text,
							readOnly: true,
							disabled:true
						},{
							xtype: 'numberfield',
							id: '_sbj_dom_int',
							fieldLabel: 'Days On Market',
							width: this.layoutConfig.compEval.standard.subject.text,
							readOnly: true
						}
					]
				},{
					columnWidth: this.layoutConfig.compEval.standard.width[1],
					layout: 'form',
					items: [
						{
							xtype: 'combormvcmpsrc',
							id: 'rmv_cmp1_source_enum',
							fieldLabel: 'Comp Label',
							hideLabel: !this.layoutConfig.compEval.standard.hideSubject,
							hideMode: 'offsets',
							labelStyle: "width: 50%",
							width: this.layoutConfig.compEval.standard.comp1.combo
						},{
							xtype: 'combormvcmptyp',
							id: 'rmv_cmp1_type_enum',
							fieldLabel: 'Comp Type',
							labelStyle: "width: 50%",
							hideLabel: !this.layoutConfig.compEval.standard.hideSubject,
							width: this.layoutConfig.compEval.standard.comp1.combo
						},{
							xtype: 'combormvcmpvaltyp',
							id: 'rmv_cmp1_recon_value_type_enum',
							fieldLabel: 'Rec.Val.Typ',
							labelStyle: "width: 50%",
							hideLabel: !this.layoutConfig.compEval.standard.hideSubject,
							width: this.layoutConfig.compEval.standard.comp1.combo
						},{
							xtype: 'combormvcmpsaletyp',
							id: 'rmv_cmp1_sale_type_char',
							fieldLabel: 'Sale Type',
							labelStyle: "width: 50%",
							hideLabel: !this.layoutConfig.compEval.standard.hideSubject,
							width: this.layoutConfig.compEval.standard.comp1.combo
						},{
							xtype: 'dollarfield',
							id: 'rmv_cmp1_comp_value_int',
							fieldLabel: 'Comp Val.',
							listeners: {
								blur: this.updateCompAdj
							},
							labelStyle: "width: 50%",
							hideLabel: !this.layoutConfig.compEval.standard.hideSubject,
							width: this.layoutConfig.compEval.standard.comp1.dollar
						},{
							xtype: 'textfield',
							id: 'rmv_cmp1_address1_char',
							fieldLabel: 'Str.Addr',
							labelStyle: "width: 50%",
							hideLabel: !this.layoutConfig.compEval.standard.hideSubject,
							width: this.layoutConfig.compEval.standard.comp1.text
						},{
							xtype: 'textfield',
							id: 'rmv_cmp1_city_char',
							fieldLabel: 'City',
							labelStyle: "width: 50%",
							hideLabel: !this.layoutConfig.compEval.standard.hideSubject,
							width: this.layoutConfig.compEval.standard.comp1.text
						},{
							xtype: 'combostates',
							id: 'rmv_cmp1_state_char',
							fieldLabel: 'State',
							labelStyle: "width: 50%",
							hideLabel: !this.layoutConfig.compEval.standard.hideSubject,
							width: this.layoutConfig.compEval.standard.comp1.combo
						},{
							xtype: 'textfield',
							id: 'rmv_cmp1_zip_char',
							fieldLabel: 'Zip',
							labelStyle: "width: 50%",
							hideLabel: !this.layoutConfig.compEval.standard.hideSubject,
							width: this.layoutConfig.compEval.standard.comp1.text
						},{
							xtype: 'textfield',
							id: 'rmv_cmp1_sbjdst_char',
							fieldLabel: 'Dist.Subj.',
							labelStyle: "width: 50%",
							hideLabel: !this.layoutConfig.compEval.standard.hideSubject,
							width: this.layoutConfig.compEval.standard.comp1.text
						},{
							xtype: 'numberfield',
							id: 'rmv_cmp1_dom_int',
							fieldLabel: 'DOM',
							labelStyle: "width: 50%",
							hideLabel: !this.layoutConfig.compEval.standard.hideSubject,
							width: this.layoutConfig.compEval.standard.comp1.text
						}
					]
				},{
					columnWidth: this.layoutConfig.compEval.standard.width[2],
					layout: 'form',
					defaults: {
						width: this.layoutConfig.compEval.standard.fieldWidth
					},
					items: [
						{
							xtype: 'combormvcmpsrc',
							id: 'rmv_cmp2_source_enum',
							hideLabel: true,
							width: this.layoutConfig.compEval.standard.general.combo
						},{
							xtype: 'combormvcmptyp',
							id: 'rmv_cmp2_type_enum',
							hideLabel: true,
							width: this.layoutConfig.compEval.standard.general.combo
						},{
							xtype: 'combormvcmpvaltyp',
							id: 'rmv_cmp2_recon_value_type_enum',
							hideLabel: true,
							width: this.layoutConfig.compEval.standard.general.combo
						},{
							xtype: 'combormvcmpsaletyp',
							id: 'rmv_cmp2_sale_type_char',
							hideLabel: true,
							width: this.layoutConfig.compEval.standard.general.combo
						},{
							xtype: 'dollarfield',
							id: 'rmv_cmp2_comp_value_int',
							hideLabel: true,
							listeners: {
								blur: this.updateCompAdj
							},
							width: this.layoutConfig.compEval.standard.general.dollar
						},{
							xtype: 'textfield',
							id: 'rmv_cmp2_address1_char',
							hideLabel: true,
							width: this.layoutConfig.compEval.standard.general.text
						},{
							xtype: 'textfield',
							id: 'rmv_cmp2_city_char',
							hideLabel: true,
							width: this.layoutConfig.compEval.standard.general.text
						},{
							xtype: 'combostates',
							width: 55,
							id: 'rmv_cmp2_state_char',
							hideLabel: true,
							width: this.layoutConfig.compEval.standard.general.combo
						},{
							xtype: 'textfield',
							width: 75,
							id: 'rmv_cmp2_zip_char',
							hideLabel: true,
							width: this.layoutConfig.compEval.standard.general.text
						},{
							xtype: 'textfield',
							id: 'rmv_cmp2_sbjdst_char',
							hideLabel: true,
							width: this.layoutConfig.compEval.standard.general.text
						},{
							xtype: 'numberfield',
							id: 'rmv_cmp2_dom_int',
							hideLabel: true,
							width: this.layoutConfig.compEval.standard.general.text
						}
					]
				},{
					columnWidth: this.layoutConfig.compEval.standard.width[3],
					layout: 'form',
					defaults: {
						width: this.layoutConfig.compEval.standard.fieldWidth
					},
					items: [
						{
							xtype: 'combormvcmpsrc',
							id: 'rmv_cmp3_source_enum',
							hideLabel: true,
							width: this.layoutConfig.compEval.standard.general.combo
						},{
							xtype: 'combormvcmptyp',
							id: 'rmv_cmp3_type_enum',
							hideLabel: true,
							width: this.layoutConfig.compEval.standard.general.combo
						},{
							xtype: 'combormvcmpvaltyp',
							id: 'rmv_cmp3_recon_value_type_enum',
							hideLabel: true,
							width: this.layoutConfig.compEval.standard.general.combo
						},{
							xtype: 'combormvcmpsaletyp',
							id: 'rmv_cmp3_sale_type_char',
							hideLabel: true,
							width: this.layoutConfig.compEval.standard.general.combo
						},{
							xtype: 'dollarfield',
							id: 'rmv_cmp3_comp_value_int',
							hideLabel: true,
							listeners: {
								blur: this.updateCompAdj
							},
							width: this.layoutConfig.compEval.standard.general.dollar
						},{
							xtype: 'textfield',
							id: 'rmv_cmp3_address1_char',
							hideLabel: true,
							width: this.layoutConfig.compEval.standard.general.text
						},{
							xtype: 'textfield',
							id: 'rmv_cmp3_city_char',
							hideLabel: true,
							width: this.layoutConfig.compEval.standard.general.text
						},{
							xtype: 'combostates',
							id: 'rmv_cmp3_state_char',
							hideLabel: true,
							width: this.layoutConfig.compEval.standard.general.combo
						},{
							xtype: 'textfield',
							width: 75,
							id: 'rmv_cmp3_zip_char',
							hideLabel: true,
							width: this.layoutConfig.compEval.standard.general.text
						},{
							xtype: 'textfield',
							id: 'rmv_cmp3_sbjdst_char',
							hideLabel: true,
							width: this.layoutConfig.compEval.standard.general.text
						},{
							xtype: 'numberfield',
							id: 'rmv_cmp3_dom_int',
							hideLabel: true,
							width: this.layoutConfig.compEval.standard.general.text
						}
					]
				},
				{
					columnWidth: 1.00,
					layout: 'form',
					bodyStyle: 'clear: both;'
				},
				// ROW - SLD/LST DT
				{
					// Subject
					columnWidth: this.layoutConfig.compEval.adj.width[0],
					layout: 'form',
					hidden: this.layoutConfig.compEval.adj.hideSubject,
					items: [{
						xtype: 'textfield',
						id: '_subject_sldlst_date',
						fieldLabel: 'Sold/List Date',
						width: this.layoutConfig.compEval.adj.subject.text,
						labelStyle: "width: 50%",
						readOnly: true,
						disabled:true
					}]
				},{
					// Comp 1
					columnWidth: this.layoutConfig.compEval.adj.width[1],
					layout: 'form',
					items: [{
						xtype: 'datermv',
						id: 'rmv_cmp1_sldlst_date',
						fieldLabel: 'Sold/List DT',
						width: this.layoutConfig.compEval.adj.comp1.combo,
						labelStyle: "width: 64.1%",
						hideLabel: !this.layoutConfig.compEval.adj.hideSubject
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[2],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp1_sldlst_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.comp1.dollar
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[3],
					layout: 'form',
					items: [{
						xtype: 'datermv',
						id: 'rmv_cmp2_sldlst_date',
						hideLabel: true,
						width: this.layoutConfig.compEval.adj.general.combo
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[4],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp2_sldlst_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.general.dollar
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[5],
					layout: 'form',
					items: [{
						xtype: 'datermv',
						id: 'rmv_cmp3_sldlst_date',
						hideLabel: true,
						width: this.layoutConfig.compEval.adj.general.combo
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[6],
					layout: 'form',
					defaults: {
						width: 74
					},
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp3_sldlst_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.general.dollar
					}]
				},

				// ROW - LOT SIZE
				{   // Subject
					columnWidth: this.layoutConfig.compEval.adj.width[0],
					layout: 'form',
					hidden: this.layoutConfig.compEval.adj.hideSubject,
					items: [{
						xtype: 'textfield',
						id: '_subject_lotsize_char',
						fieldLabel: 'Lot Size',
						width: this.layoutConfig.compEval.adj.subject.text,
						labelStyle: "width: 50%",
						readOnly: true
					}]
				},{
					// Comp 1
					columnWidth: this.layoutConfig.compEval.adj.width[1],
					layout: 'form',
					items: [{
						xtype: 'textfield',
						id: 'rmv_cmp1_lotsize_char',
						fieldLabel: 'Lot Size',
						width: this.layoutConfig.compEval.adj.comp1.text,
						labelStyle: "width: 64.1%",
						hideLabel: !this.layoutConfig.compEval.adj.hideSubject
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[2],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp1_lotsize_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.comp1.dollar
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[3],
					layout: 'form',
					items: [{
						xtype: 'textfield',
						id: 'rmv_cmp2_lotsize_char',
						hideLabel: true,
						width: this.layoutConfig.compEval.adj.general.text
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[4],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp2_lotsize_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.general.dollar
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[5],
					layout: 'form',
					items: [{
						xtype: 'textfield',
						id: 'rmv_cmp3_lotsize_char',
						hideLabel: true,
						width: this.layoutConfig.compEval.adj.general.text
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[6],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp3_lotsize_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.general.dollar
					}]
				},


				// ROW - GLA
				{
					// Subject
					columnWidth: this.layoutConfig.compEval.adj.width[0],
					layout: 'form',
					hidden: this.layoutConfig.compEval.adj.hideSubject,
					items: [{
						xtype: 'textfield',
						id: '_subject_gla_char',
						fieldLabel: 'GLA',
						width: this.layoutConfig.compEval.adj.subject.text,
						labelStyle: "width: 50%",
						readOnly: true
					}]
				},{
					// Comp 1
					columnWidth: this.layoutConfig.compEval.adj.width[1],
					layout: 'form',
					items: [{
						xtype: 'textfield',
						id: 'rmv_cmp1_gla_char',
						fieldLabel: 'GLA',
						width: this.layoutConfig.compEval.adj.comp1.text,
						labelStyle: "width: 64.1%",
						hideLabel: !this.layoutConfig.compEval.adj.hideSubject
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[2],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp1_gla_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.comp1.dollar
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[3],
					layout: 'form',
					items: [{
						xtype: 'textfield',
						id: 'rmv_cmp2_gla_char',
						hideLabel: true,
						width: this.layoutConfig.compEval.adj.general.text
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[4],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp2_gla_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.general.dollar
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[5],
					layout: 'form',
					items: [{
						xtype: 'textfield',
						id: 'rmv_cmp3_gla_char',
						hideLabel: true,
						width: this.layoutConfig.compEval.adj.general.text
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[6],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp3_gla_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.general.dollar
					}]
				},

				// ROW - CONDITION
				{
					// Subject
					columnWidth: this.layoutConfig.compEval.adj.width[0],
					layout: 'form',
					hidden: this.layoutConfig.compEval.adj.hideSubject,
					items: [{
						xtype: 'textfield',
						id: '_subject_condition_char',
						fieldLabel: 'Condition',
						width: this.layoutConfig.compEval.adj.subject.text,
						labelStyle: "width: 50%",
						readOnly: true
					}]
				},{
					// Comp 1
					columnWidth: this.layoutConfig.compEval.adj.width[1],
					layout: 'form',
					items: [{
						xtype: 'combormvcmpcnd',
						id: 'rmv_cmp1_condition_char',
						fieldLabel: 'Condition',
						width: this.layoutConfig.compEval.adj.comp1.combo,
						labelStyle: "width: 64.1%",
						hideLabel: !this.layoutConfig.compEval.adj.hideSubject
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[2],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp1_condition_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.comp1.dollar
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[3],
					layout: 'form',
					items: [{
						xtype: 'combormvcmpcnd',
						id: 'rmv_cmp2_condition_char',
						hideLabel: true,
						width: this.layoutConfig.compEval.adj.general.combo
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[4],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp2_condition_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.general.dollar
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[5],
					layout: 'form',
					items: [{
						xtype: 'combormvcmpcnd',
						id: 'rmv_cmp3_condition_char',
						hideLabel: true,
						width: this.layoutConfig.compEval.adj.general.combo
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[6],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp3_condition_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.general.dollar
					}]
				},

				// ROW - ROOMS
				{
					// Subject
					columnWidth: this.layoutConfig.compEval.adj.width[0],
					layout: 'form',
					hidden: this.layoutConfig.compEval.adj.hideSubject,
					items: [{
						xtype: 'textfield',
						id: '_subject_rooms_int',
						fieldLabel: 'Rooms',
						width: this.layoutConfig.compEval.adj.subject.text,
						labelStyle: "width: 50%",
						readOnly: true
					}]
				},{
					// Comp 1
					columnWidth: this.layoutConfig.compEval.adj.width[1],
					layout: 'form',
					items: [{
						xtype: 'textfield',
						id: 'rmv_cmp1_rooms_int',
						fieldLabel: 'Rooms',
						width: this.layoutConfig.compEval.adj.comp1.text,
						labelStyle: "width: 64.1%",
						hideLabel: !this.layoutConfig.compEval.adj.hideSubject
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[2],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp1_rooms_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.comp1.dollar
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[3],
					layout: 'form',
					items: [{
						xtype: 'textfield',
						id: 'rmv_cmp2_rooms_int',
						hideLabel: true,
						width: this.layoutConfig.compEval.adj.general.text
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[4],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp2_rooms_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.general.dollar
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[5],
					layout: 'form',
					items: [{
						xtype: 'textfield',
						id: 'rmv_cmp3_rooms_int',
						hideLabel: true,
						width: this.layoutConfig.compEval.adj.general.text
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[6],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp3_rooms_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.general.dollar
					}]
				},

				// ROW - BEDS
				{
					// Subject
					columnWidth: this.layoutConfig.compEval.adj.width[0],
					layout: 'form',
					hidden: this.layoutConfig.compEval.adj.hideSubject,
					items: [{
						xtype: 'textfield',
						id: '_subject_beds_int',
						fieldLabel: 'Beds',
						width: this.layoutConfig.compEval.adj.subject.text,
						labelStyle: "width: 50%",
						readOnly: true
					}]
				},{
					// Comp 1
					columnWidth: this.layoutConfig.compEval.adj.width[1],
					layout: 'form',
					items: [{
						xtype: 'combormvbeds',
						id: 'rmv_cmp1_beds_int',
						fieldLabel: 'Beds',
						width: this.layoutConfig.compEval.adj.comp1.combo,
						labelStyle: "width: 64.1%",
						hideLabel: !this.layoutConfig.compEval.adj.hideSubject
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[2],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp1_beds_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.comp1.dollar
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[3],
					layout: 'form',
					items: [{
						xtype: 'combormvbeds',
						id: 'rmv_cmp2_beds_int',
						hideLabel: true,
						width: this.layoutConfig.compEval.adj.general.combo
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[4],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp2_beds_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.general.dollar
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[5],
					layout: 'form',
					items: [{
						xtype: 'combormvbeds',
						id: 'rmv_cmp3_beds_int',
						hideLabel: true,
						width: this.layoutConfig.compEval.adj.general.combo
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[6],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp3_beds_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.general.dollar
					}]
				},

				// ROW - BATHS
				{
					// Subject
					columnWidth: this.layoutConfig.compEval.adj.width[0],
					layout: 'form',
					hidden: this.layoutConfig.compEval.adj.hideSubject,
					items: [{
						xtype: 'textfield',
						id: '_subject_baths_int',
						fieldLabel: 'Baths',
						width: this.layoutConfig.compEval.adj.subject.text,
						labelStyle: "width: 50%",
						readOnly: true
					}]
				},{
					// Comp 1
					columnWidth: this.layoutConfig.compEval.adj.width[1],
					layout: 'form',
					items: [{
						xtype: 'combormvbaths',
						id: 'rmv_cmp1_baths_int',
						fieldLabel: 'Baths',
						width: this.layoutConfig.compEval.adj.comp1.combo,
						labelStyle: "width: 64.1%",
						hideLabel: !this.layoutConfig.compEval.adj.hideSubject
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[2],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp1_baths_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.comp1.dollar
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[3],
					layout: 'form',
					items: [{
						xtype: 'combormvbaths',
						id: 'rmv_cmp2_baths_int',
						hideLabel: true,
						width: this.layoutConfig.compEval.adj.general.combo
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[4],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp2_baths_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.general.dollar
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[5],
					layout: 'form',
					items: [{
						xtype: 'combormvbaths',
						id: 'rmv_cmp3_baths_int',
						hideLabel: true,
						width: this.layoutConfig.compEval.adj.general.combo
					}]
				},{
					columnWidth: this.layoutConfig.compEval.adj.width[6],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp3_baths_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.general.dollar
					}]
				},

				//////////////////////////////////////////////////
				// DYNAMIC DROP DOWNS                           //
				//////////////////////////////////////////////////

				{
					// Combo Label
					columnWidth: this.layoutConfig.compEval.dynamicAdj.width[0],
					layout: 'form',
					items: [{
						xtype: 'combormvcmpopts',
						id: 'rmv_cmp1_opt1_label_char',
						hideLabel: true,
						listeners: {
							select: this.vCmpOptions
						},
						width: this.layoutConfig.compEval.dynamicAdj.comboWidth
					}]
				},{
					// Subject
					columnWidth: this.layoutConfig.compEval.dynamicAdj.width[1],
					layout: 'form',
					hidden: this.layoutConfig.compEval.dynamicAdj.hideSubject,
					items: [{
						html:"&nbsp;"
					}]
				},{
					// Comp 1
					columnWidth: this.layoutConfig.compEval.dynamicAdj.width[2],
					layout: 'form',
					items: [{
						xtype: 'textfield',
						id: 'rmv_cmp1_opt1_value_char',
						hideLabel: true,
						width: this.layoutConfig.compEval.dynamicAdj.comp1.text
					}]
				},{
					columnWidth: this.layoutConfig.compEval.dynamicAdj.width[3],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp1_opt1_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.comp1.dollar
					}]
				},{
					columnWidth: this.layoutConfig.compEval.dynamicAdj.width[4],
					layout: 'form',
					items: [{
						xtype: 'textfield',
						id: 'rmv_cmp2_opt1_value_char',
						hideLabel: true,
						width: this.layoutConfig.compEval.adj.general.text
					}]
				},{
					columnWidth: this.layoutConfig.compEval.dynamicAdj.width[5],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp2_opt1_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.general.dollar
					}]
				},{
					columnWidth: this.layoutConfig.compEval.dynamicAdj.width[6],
					layout: 'form',
					items: [{
						xtype: 'textfield',
						id: 'rmv_cmp3_opt1_value_char',
						hideLabel: true,
						width: this.layoutConfig.compEval.adj.general.text
					}]
				},{
					columnWidth: this.layoutConfig.compEval.dynamicAdj.width[7],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp3_opt1_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.general.dollar
					}]
				},


				// row 2
				{
					// Combo Label
					columnWidth: this.layoutConfig.compEval.dynamicAdj.width[0],
					layout: 'form',
					items: [{
						xtype: 'combormvcmpopts',
						id: 'rmv_cmp1_opt2_label_char',
						hideLabel: true,
						listeners: {
							select: this.vCmpOptions
						},
						width: this.layoutConfig.compEval.dynamicAdj.comboWidth
					}]
				},{
					// Subject
					columnWidth: this.layoutConfig.compEval.dynamicAdj.width[1],
					layout: 'form',
					hidden: this.layoutConfig.compEval.dynamicAdj.hideSubject,
					items: [{
						html:"&nbsp;"
					}]
				},{
					// Comp 1
					columnWidth: this.layoutConfig.compEval.dynamicAdj.width[2],
					layout: 'form',
					items: [{
						xtype: 'textfield',
						id: 'rmv_cmp1_opt2_value_char',
						hideLabel: true,
						width: this.layoutConfig.compEval.dynamicAdj.comp1.text
					}]
				},{
					columnWidth: this.layoutConfig.compEval.dynamicAdj.width[3],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp1_opt2_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.comp1.dollar
					}]
				},{
					columnWidth: this.layoutConfig.compEval.dynamicAdj.width[4],
					layout: 'form',
					items: [{
						xtype: 'textfield',
						id: 'rmv_cmp2_opt2_value_char',
						hideLabel: true,
						width: this.layoutConfig.compEval.adj.general.text
					}]
				},{
					columnWidth: this.layoutConfig.compEval.dynamicAdj.width[5],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp2_opt2_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.general.dollar
					}]
				},{
					columnWidth: this.layoutConfig.compEval.dynamicAdj.width[6],
					layout: 'form',
					items: [{
						xtype: 'textfield',
						id: 'rmv_cmp3_opt2_value_char',
						hideLabel: true,
						width: this.layoutConfig.compEval.adj.general.text
					}]
				},{
					columnWidth: this.layoutConfig.compEval.dynamicAdj.width[7],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp3_opt2_adj_int',
						hideLabel: true,
						listeners: {
							blur: this.updateCompAdj
						},
						width: this.layoutConfig.compEval.adj.general.dollar
					}]
				},
				//////////////////////////////////////////////////
				// END DYNAMIC DROP DOWNS                       //
				//////////////////////////////////////////////////

				// ROW - ADJ VAL
				{
					columnWidth: this.layoutConfig.compEval.concl.width[0],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp1_est_subject_value_int',
						fieldLabel: 'Adj Value',
						readOnly: true,
						width: this.layoutConfig.compEval.concl.comp1.firstDollar,
						labelStyle: this.layoutConfig.compEval.concl.comp1LabelStyle
					}]
				},{
					columnWidth: this.layoutConfig.compEval.concl.width[1],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'cmp1_adj_col2',
						hideLabel: true,
						readOnly: true,
						width: this.layoutConfig.compEval.concl.comp1.dollar
					}]
				},{
					columnWidth: this.layoutConfig.compEval.concl.width[2],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp2_est_subject_value_int',
						hideLabel: true,
						readOnly: true,
						width: this.layoutConfig.compEval.concl.general.firstDollar
					}]
				},{
					columnWidth: this.layoutConfig.compEval.concl.width[3],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'cmp2_adj_col2',
						hideLabel: true,
						readOnly: true,
						width: this.layoutConfig.compEval.concl.general.dollar
					}]
				},{
					columnWidth: this.layoutConfig.compEval.concl.width[4],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'rmv_cmp3_est_subject_value_int',
						hideLabel: true,
						readOnly: true,
						width: this.layoutConfig.compEval.concl.general.firstDollar
					}]
				},{
					columnWidth: this.layoutConfig.compEval.concl.width[5],
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						id: 'cmp3_adj_col2',
						hideLabel: true,
						readOnly: true,
						width: this.layoutConfig.compEval.concl.general.dollar
					}]
				},

				{
					columnWidth: 1.00,
					layout: 'form',
					bodyStyle: 'clear: both;'
				},

				// TEXT COMMENTS
				{
					columnWidth:
						this.layoutConfig.compEval.concl.width[0] +
						this.layoutConfig.compEval.concl.width[1],
					layout: 'form',
					items: [{
						xtype: 'textarea',
						id: 'rmv_cmp1_notes_text',
						fieldLabel: 'Comments',
						validator: this.vCmpValComments,
						width: this.layoutConfig.compEval.concl.comp1.firstText,
						labelStyle: this.layoutConfig.compEval.concl.comp1CommentLabelStyle
					}]
				},{
					columnWidth:
						this.layoutConfig.compEval.concl.width[2] +
						this.layoutConfig.compEval.concl.width[3],
					layout: 'form',
					items: [{
						xtype: 'textarea',
						id: 'rmv_cmp2_notes_text',
						hideLabel: true,
						validator: this.vCmpValComments,
						anchor: '96%'
					}]
				},{
					columnWidth:
						this.layoutConfig.compEval.concl.width[4] +
						this.layoutConfig.compEval.concl.width[5],
					layout: 'form',
					items: [{
						xtype: 'textarea',
						id: 'rmv_cmp3_notes_text',
						hideLabel: true,
						validator: this.vCmpValComments,
						anchor: '96%'
					}]
				},

				{
					columnWidth: 1.00,
					layout: 'form',
					bodyStyle: 'clear: both;'
				},

				// COMP ADJ 15% COMMENTS
				{
					columnWidth:
						this.layoutConfig.compEval.concl.width[0] +
						this.layoutConfig.compEval.concl.width[1],
					layout: 'form',
					id: 'textarea-cmp1-adj-comments',
					hidden: true,
					items: [{
						xtype: 'textarea',
						id: 'rmv_cmp1_adj_notes_text',
						fieldLabel: '<span ext:qtip="Comments required because Comp Val. is greater than 15% different than the Adj Value">Comments on 15% Adj.</span>',
						disabled: true,
						//validator: this.vCmpValComments,
						width: this.layoutConfig.compEval.concl.comp1.firstText,
						labelStyle: this.layoutConfig.compEval.concl.comp1CommentLabelStyle
					}]
				},{
					columnWidth:
						this.layoutConfig.compEval.concl.width[2] +
						this.layoutConfig.compEval.concl.width[3],
					layout: 'form',
					id: 'textarea-cmp2-adj-comments',
					hidden: true,
					items: [{
						xtype: 'textarea',
						id: 'rmv_cmp2_adj_notes_text',
						hideLabel: true,
						disabled: true,
						//validator: this.vCmpValComments,
						anchor: '96%'
					}]
				},{
					columnWidth:
						this.layoutConfig.compEval.concl.width[4] +
						this.layoutConfig.compEval.concl.width[5],
					layout: 'form', // __MARKER__
					id: 'textarea-cmp3-adj-comments',
					hidden: true,
					items: [{
						xtype: 'textarea',
						id: 'rmv_cmp3_adj_notes_text',
						hideLabel: true,
						disabled: true,
						//validator: this.vCmpValComments,
						anchor: '96%'
					}]
				}]
			},{
				xtype: 'fieldset',
				layout: 'column',
				title: 'Prior Reconciliation Market Value',
				id: 'fs-prior-recon-mktval',
				items: [{
					columnWidth: 0.33,
					layout: 'form',
					defaults: {
						width: this.defaultTextFieldWidthMedium
					},
					items: [{
						xtype: 'textfield',
						id: 'rmv_priormkt_preparedby_char',
						fieldLabel: 'Prior Prepared By',
						readonly: true,
						value: ''
					},{
						xtype: 'dollarfield',
						id: 'rmv_priormkt_preparedasis_char',
						fieldLabel: 'Prior As Is',
						readonly: true,
						listeners: {
							blur: function() {
								Ext.getCmp('form-rmv').updatePriorRMVVariance();
							}
						}
					}]
				},{
					columnWidth: 0.34,
					layout: 'form',
					defaults: {
						width: this.defaultTextFieldWidthMedium
					},
					items: [{
						xtype: 'datermv',
						id: 'rmv_priormkt_prepared_date',
						fieldLabel: 'Prior Prep. On',
						readonly: true,
						listeners: {
							change: function() {
								Ext.getCmp('form-rmv').updatePriorRMVComments();
							}
						}
					},{
						xtype: 'dollarfield',
						id: 'rmv_priormkt_preparedrepaired_char',
						fieldLabel: 'Prior As Repaired',
						readonly: true
					}]
				},{
					columnWidth: 0.33,
					layout: 'form',
					defaults: {
						width: this.defaultTextFieldWidthMedium
					},
					items: [{
						xtype: 'label',
						labelSeparator: '&nbsp;',
						fieldLabel: ' '
					},{
						xtype: 'dollarfield',
						id: 'rmv_priormkt_preparedrepaircosts_char',
						fieldLabel: 'Prior Repair Costs',
						readonly: true
					}]
				},{
					columnWidth: 1.00,
					layout: 'form',
					labelWidth: 360,
					items: [{
						id: 'derived_prior_variance',
						xtype: 'percentfield',
						readOnly: true,
						width: 80,
						fieldLabel: "Variance between Prior RMV and Reviewer's Reconciled Value"
					}]
				},{
					columnWidth: 1.00,
					layout: 'form',
					labelSeparator: '?',
					items: [{
						id: 'rmv_prior_change_notes_text',
						xtype: 'hidden',
						value: 'No'
					}]
				},{
					columnWidth: 1.00,
					id: 'fm-prior-reason-label',
					layout: 'form',
					hidden: true,
					items: [{
						xtype: 'label',
						style: 'font: 12px arial; font-weight: bold',
						text: 'The significant change is greater than 2.5% on a per/month basis, please provided a detailed comment addressing the change in Value.'
					}]
				},{
					columnWidth: 1.00,
					id: 'fm-prior-reason',
					layout: 'form',
					items: [{
						xtype: 'combo',
						id: 'rmv_prior_reason_text',
						width: 300,
						fieldLabel: 'Reason',
						store: new Ext.data.SimpleStore({
							fields: ['item'],
							data : [
								['Initial BPO'],
								['Interior Access vs Drive-By'],
								['Market Sales'],
								['Change in Subject Condition'],
								['Environmental Impact'],
								['Market Saturation'],
								['Illegal Bldg Addition'],
								['Encroachments'],
								['Adverse Natural Effects (flood, fire, etc)'],
								['Wrong Property'],
								['Square Footage Discrepancy'],
								['Rehabbed'],
								['Desktop'],
								['No Audit RMV ']
							]
						}),
						displayField:'item',
						valueField:'item',
						forceSelection: true,
						editable:true,
						triggerAction: 'all',
						mode: 'local',
						selectOnFocus:true,
						allowBlank: true
					}]
				},{
					columnWidth: 1.00,
					layout: 'form',
					id: 'fm-prior-reason-comments',
					items: [{
						xtype: 'textarea',
						anchor: '90%',
						id: 'rmv_prior_comments_text',
						fieldLabel: 'Comments'
					}]
				}]
			},{
				xtype: 'fieldset',
				title: 'Repair Addendum',
				layout: 'column',
				items: [{
					columnWidth: 0.30,
					layout: 'form',
					defaults: {
						width: this.defaultTextFieldWidthShort
					},
					items: [{
						id: 'chkbx_rpr_structural_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'Structural'
					},{
						id: 'chkbx_rpr_roof_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'Roof'
					},{
						id: 'chkbx_rpr_windr_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'Windows/Doors'
					},{
						id: 'chkbx_rpr_painting_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'Exterior Painting'
					},{
						id: 'chkbx_rpr_sidingtrim_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'Siding/Trim'
					},{
						id: 'chkbx_rpr_landscape_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'Landscape'
					},{
						id: 'chkbx_rpr_garage_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'Garage'
					},{
						id: 'chkbx_rpr_poolspa_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'Pool/Spa'
					},{
						id: 'chkbx_rpr_outblds_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'Outbuildings'
					},{
						id: 'chkbx_rpr_intpnt_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'Interior Painting'
					},{
						id: 'chkbx_rpr_electrical_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'Electrical'
					}]
				},{
					columnWidth: 0.20,
					layout: 'form',
					hideLabel: true,
					labelWidth: 8,
					defaults: {
						width: this.defaultTextFieldWidthMicro
					},
					items: [{
						id: 'reconrpradd_structural_int',
						xtype: 'dollarfield'
					},{
						id: 'reconrpradd_roof_int',
						xtype: 'dollarfield'
					},{
						id: 'reconrpradd_windr_int',
						xtype: 'dollarfield'
					},{
						id: 'reconrpradd_painting_int',
						xtype: 'dollarfield'
					},{
						id: 'reconrpradd_sidingtrim_int',
						xtype: 'dollarfield'
					},{
						id: 'reconrpradd_landscape_int',
						xtype: 'dollarfield'
					},{
						id: 'reconrpradd_garage_int',
						xtype: 'dollarfield'
					},{
						id: 'reconrpradd_poolspa_int',
						xtype: 'dollarfield'
					},{
						id: 'reconrpradd_outblds_int',
						xtype: 'dollarfield'
					},{
						id: 'reconrpradd_intpnt_int',
						xtype: 'dollarfield'
					},{
						id: 'reconrpradd_electrical_int',
						xtype: 'dollarfield'
					}]
				},{
					columnWidth: 0.30,
					layout: 'form',
					defaults: {
						width: this.defaultTextFieldWidthShort
					},
					items: [{
						id: 'chkbx_rpr_trash_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'Trash Removal'
					},{
						id: 'chkbx_rpr_trmpstdmg_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'Termite/Pest'
					},{
						id: 'chkbx_rpr_plmbfxt_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'Plumb/Fixt'
					},{
						id: 'chkbx_rpr_flrcpt_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'Floor/Carpet'
					},{
						id: 'chkbx_rpr_wallsclg_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'Walls/Ceiling'
					},{
						id: 'chkbx_rpr_util_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'Utilities'
					},{
						id: 'chkbx_rpr_appls_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'Appliances'
					},{
						id: 'chkbx_rpr_cabcarp_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'Kit. Cab/Carp'
					},{
						id: 'chkbx_rpr_hvac_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'HVAC'
					},{
						id: 'chkbx_rpr_mold_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'Mold'
					},{
						id: 'chkbx_rpr_ignore',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'IGNORE',
						hidden: true,
						disabled: true
					}]
				},{
					columnWidth: 0.20,
					layout: 'form',
					hideLabel: true,
					labelWidth: 8,
					defaults: {
						width: this.defaultTextFieldWidthMicro
					},
					items: [{
						id: 'reconrpradd_trash_int',
						xtype: 'dollarfield'
					},{
						id: 'reconrpradd_trmpstdmg_int',
						xtype: 'dollarfield'
					},{
						id: 'reconrpradd_plmbfxt_int',
						xtype: 'dollarfield'
					},{
						id: 'reconrpradd_flrcpt_int',
						xtype: 'dollarfield'
					},{
						id: 'reconrpradd_wallsclg_int',
						xtype: 'dollarfield'
					},{
						id: 'reconrpradd_util_int',
						xtype: 'dollarfield'
					},{
						id: 'reconrpradd_appls_int',
						xtype: 'dollarfield'
					},{
						id: 'reconrpradd_cabcarp_int',
						xtype: 'dollarfield'
					},{
						id: 'reconrpradd_hvac_int',
						xtype: 'dollarfield'
					},{
						id: 'reconrpradd_mold_int',
						xtype: 'dollarfield'
					},{
						id: 'reconrpraddxxx_IGNORE',
						xtype: 'numberfield',
						fieldLabel: ' ',
						labelSeparator: '',
						hidden: true,
						disabled: true
					}]
				},{
					columnWidth: 1.00,
					xtype: 'box',
					html: '&nbsp;'
				},{
					columnWidth: 0.20,
					layout: 'form',
					items: [{
						id: 'chkbx_rpr_other1value_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'Other'

					}]
				},{
					columnWidth: 0.30,
					layout: 'form',
					items: [{
						xtype: 'textfield',
						width: 120,
						id: 'reconrpradd_other1_char',
						hideLabel: true,
						emptyText: 'Description...'

					}]
				},{
					columnWidth: 0.50,
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						width: 65,
						id: 'reconrpradd_other1value_int',
						fieldLabel: 'Amount'
					}]
				},{
					columnWidth: 1.00,
					xtype: 'box',
					html: '&nbsp;'
				},{
					columnWidth: 0.20,
					layout: 'form',
					items: [{
						id: 'chkbx_rpr_other2value_int',
						xtype: 'checkbox',
						hideLabel: true,
						boxLabel: 'Other'

					}]
				},{
					columnWidth: 0.30,
					layout: 'form',
					items: [{
						xtype: 'textfield',
						width: 120,
						id: 'reconrpradd_other2_char',
						hideLabel: true,
						emptyText: 'Description...'

					}]
				},{
					columnWidth: 0.50,
					layout: 'form',
					items: [{
						xtype: 'dollarfield',
						width: 65,
						id: 'reconrpradd_other2value_int',
						fieldLabel: 'Amount'
					}]
				}]
			},{
				xtype: 'fieldset',
				id: 'fs-spo-comments',
				title: 'SPO Comments',
				layout: 'column',
				hidden: true,
				items: [{
					columnWidth: 1.00,
					layout: 'form',
					id: 'fm-spo-comments',
					items: [{
						xtype: 'textarea',
						anchor: '90%',
						id: 'rmv_spo_comments_text',
						hideLabel: true,
						allowBlank: true
					}]
				}]
			}]
		});
	};

	Ext.extend(FormRMV, Ext.form.FormPanel, {
		defaultTextFieldWidthMicro: 65,
		defaultTextFieldWidthShort: 125,
		defaultTextFieldWidthMedium: 85,
		defaultTextFieldWidthLong: 95,
		defaultTextFieldWidthComps: 78,

		dataRecord: null,

		toggleMapOptionRadios: function(rgId, isChecked) {
			var rg = Ext.getCmp(rgId);
			if (isChecked) {
				rg.items.items[0].enable();
				rg.items.items[1].enable();
			} else {
				rg.items.items[0].disable();
				rg.items.items[1].disable();
				rg.items.items[0].setValue(false); 
				rg.items.items[1].setValue(false); 
			}
		},

		updateOrigCommentsLabel: function() {
			var labelTpl = "Considering the Orig. Date: {0} and Orig.App.Val ${1}:";
			var numOrigAppValue = Ext.getCmp('rmv_orig_app_value_int').getValue();
			var dtOrig = Ext.getCmp('rmv_orig_date').getValue();
			var dtOrigFormatted = '[not set]';
			if (Ext.isDate(dtOrig)) {
				dtOrigFormatted = dtOrig.format("m/d/Y");
			}

			var numOrigAppValueFormatted = '[not set]';
			if (Ext.isNumber(numOrigAppValue)) {
				numOrigAppValueFormatted = Ext.util.Format.number(numOrigAppValue, '0,000');
			}

			var labelTxt = String.format(labelTpl, dtOrigFormatted, numOrigAppValueFormatted);
			Ext.get('orig_comments_label').update(labelTxt);
		},

		updatePriorRMVVariance: function() {

			var getCmp = Ext.getCmp;

			getCmp('derived_prior_variance').setValue(this.getDerivedPriorRmvVariance());


			if (this.getPerMonthPriorReconVariance() > 2.5) {
				getCmp('fm-prior-reason').setVisible(true);
				getCmp('fm-prior-reason-label').setVisible(true);
				getCmp('fm-prior-reason-comments').setVisible(true);
				getCmp('rmv_prior_reason_text').allowBlank   = false;
				getCmp('rmv_prior_comments_text').allowBlank = false;
				getCmp('rmv_prior_change_notes_text').setValue("Yes");
			}
			else {
				getCmp('fm-prior-reason').setVisible(false);
				getCmp('fm-prior-reason-label').setVisible(false);
				getCmp('fm-prior-reason-comments').setVisible(false);
				getCmp('rmv_prior_reason_text').allowBlank   = true;
				getCmp('rmv_prior_comments_text').allowBlank = true;
				getCmp('rmv_prior_change_notes_text').setValue("No");

				// Clear old comments if we're hiding these fields
				getCmp('rmv_prior_reason_text').setValue("");
				getCmp('rmv_prior_comments_text').setValue("");
			}
		},

		getDerivedPriorRmvVariance: function () {
			var commentsAsIs = parseInt(Ext.getCmp('comments_rmv_concl_as_is_int').getValue(), 10);
			var priorAsIs    = parseInt(Ext.getCmp('rmv_priormkt_preparedasis_char').getValue(), 10);
			var variance     = '';

			if (Ext.isNumber(commentsAsIs) && Ext.isNumber(priorAsIs)) {
				variance = 100*((commentsAsIs-priorAsIs)/priorAsIs);
				variance = Math.round(variance*1000)/1000;
			}

			return variance;
		},

		getPerMonthPriorReconVariance: function() {
			var diffVariance = 0;

			var variance = Ext.getCmp('derived_prior_variance').getValue();
			if (Ext.isDate(Ext.getCmp('rmv_priormkt_prepared_date').getValue())) {
				var dt = new Date();
				var dtUnix = dt.format('U');
				var dtPriorUnix = Ext.getCmp('rmv_priormkt_prepared_date').getValue().format('U');

				var monthDiff = (dtUnix - dtPriorUnix) / (30*86400);
				if (monthDiff < 1) {
					monthDiff = 1;
				}

				diffVariance = variance / monthDiff;
			}

			return Math.abs(diffVariance);
		},

		vCmpOptions: function(cb) {
			var opts = new Array();
			var ids = new Array();
			var cbValue = cb.getValue();
			var cbId = cb.getId();
			if (cbValue===null) {
				cbValue = '';
			}

			opts[1] = Ext.getCmp('rmv_cmp1_opt1_label_char').getValue();
			opts[2] = Ext.getCmp('rmv_cmp1_opt2_label_char').getValue();
		  //opts[3] = Ext.getCmp('rmv_cmp1_opt3_label_char').getValue();
		  //opts[4] = Ext.getCmp('rmv_cmp1_opt4_label_char').getValue();

			ids[1] = 'rmv_cmp1_opt1_label_char';
			ids[2] = 'rmv_cmp1_opt2_label_char';
			//ids[3] = 'rmv_cmp1_opt3_label_char';
			//ids[4] = 'rmv_cmp1_opt4_label_char';

			for (var i = 0; i < opts.length; i++) {
				if (opts[i]===null) {
					opts[i] = '';
				}

				if (cbValue===opts[i] && ids[i]!==cbId) {
					Ext.Msg.show({
						title:'Duplicate Adjustment',
						msg: 'This adjustment is already being used.',
						buttons: Ext.Msg.CANCEL,
						icon: Ext.MessageBox.ERROR
					});
					cb.reset();
					return false;
				}
			}
		},

		logException: function(btn) {
			var arcid = Ext.getCmp('reconvalarc_ID_int').getValue();
			var login = '<?=$this->userLogin?>';
			var win = new Ext.Window({
				id: 'rmv-win-log-exception',
				modal: true,
				title: 'Log Exception',
				width: 430,
				height: 315,
				frame: true,
				border: false,
				bodyStyle: 'padding: 5px',
				layout: 'form',
				items: [{
					xtype: 'form',
					id: 'rmv-form-log-exception',
					autoHeight: true,
					frame: true,
					border: false,
					url: '<?=$this->baseUrl?>/exceptions/lognew',
					labelAlign: 'top',
					buttonAlign: 'left',
					buttons: [{
						text: 'Submit',
						id: 'btn-sbmt-rmvlogex',
						iconCls: 'btn-tick',
						scope: this,
						handler: function() {
							Ext.getCmp('btn-sbmt-rmvlogex').disable();
							Ext.getCmp('btn-cncl-rmvlogex').disable();

							fm = Ext.getCmp('rmv-form-log-exception').getForm();
							var comments = Ext.getCmp('excomment').getValue();
							if (fm.isValid()) {
								fm.submit({
									clientValidation: true,
									scope: this,
									success: function(form, result) {
										Ext.getCmp('btn-sbmt-rmvlogex').enable();
										Ext.getCmp('btn-cncl-rmvlogex').enable();

										var Response = Ext.decode(result.response.responseText);
										if (Response.success===true) {
											if (Ext.getCmp('rmv-win-log-exception')) {
												Ext.getCmp('rmv-win-log-exception').close();
											}
											Ext.MessageBox.show({
												title: 'Exception Logged',
												msg: 'Your exceptions have been logged.',
												buttons: Ext.MessageBox.OK,
												icon: Ext.MessageBox.INFO
											});
											Ext.getCmp('reconvalarcexc_InitialComments_char').show();
											Ext.getCmp('reconvalarcexc_InitialComments_char').setValue(comments);
										} else {
											Ext.Msg.alert('Alert', Response.message);
										}
									},
									failure: function(form, result) {
										Ext.getCmp('btn-sbmt-rmvlogex').enable();
										Ext.getCmp('btn-cncl-rmvlogex').enable();
										var Response = Ext.decode(result.response.responseText);
										Ext.Msg.alert('Alert', Response.message);
									}
								});
							} else {
								Ext.getCmp('btn-sbmt-rmvlogex').enable();
								Ext.getCmp('btn-cncl-rmvlogex').enable();
								Ext.Msg.alert('Alert', 'You must provide comments for your exception');
							}
						}
					},{
						text: 'Cancel',
						id: 'btn-cncl-rmvlogex',
						iconCls: 'btn-cross',
						handler: function() {
							if (Ext.getCmp('rmv-win-log-exception')) {
								Ext.getCmp('rmv-win-log-exception').close();
							}
						}
					}],
					items: [{
						xtype: 'hidden',
						id: 'arcid',
						value: arcid
					},{
						xtype: 'textarea',
						id: 'excomment',
						width: 365,
						height: 196,
						fieldLabel: 'Exception Comments',
						allowBlank: false
					}]
				}]

			});
			win.show();
		},

		onHide: function(f) {
			f.getEl().up('.x-form-item').setDisplayed(false);
		},

		onShow: function(f) {
			f.getEl().up('.x-form-item').setDisplayed(true);
		},

		vCmpValComments: function(comments) {
			var minLn = '<?=$this->minCmtLn?>';
			var intMinLn = parseInt(minLn, 10);
			intMinLn = (Ext.isNumber(intMinLn)) ? intMinLn : 25;
			if (comments.length > intMinLn || comments.length == 0) {
				return true;
			}

			return 'Comments box must have more than ' + intMinLn + ' characters.';
		},

		saveDraftRecon: function() {
			this.getForm().submit({
				scope: this,
				clientValidation: false
			});
		},

		updatePriorRMVComments: function() {
			var dtToday = new Date();
			var dtCurrent = dtToday.add(Date.DAY, 1);
			var dtOneYearAgo = dtCurrent.add(Date.YEAR, -1);
			var dtPPO = Ext.getCmp('rmv_priormkt_prepared_date').getValue();
			var valVariance = Ext.getCmp('comments_value_variance').getValue();
			var comments = "The 'Prior RMV' is over twelve (12) months old. Based on the age of the 'Prior RMV' the current reconciliation is deemed more reliable given the most recent BPO, market trends and available ancillary data.";

			if (Ext.isNumber(valVariance) && Ext.isDate(dtPPO)) {
				if ( (false===dtPPO.between(dtOneYearAgo, dtCurrent)) && (valVariance > 30)) {
					//console.log('btw:[' + dtPPO.between(dtOneYearAgo, dtCurrent) + ']');
					Ext.getCmp('rmv_prior_change_notes_text').setValue('Yes');
					Ext.getCmp('rmv_prior_comments_text').setValue(comments);
				}
			}
		},

		validateRMV: function() {
			var retval = true;
			var errors = [];

			// Collection of validation functions
			// Added: 9/16/2010 by Donald Sipe
			var validators = {
				dynamicAdj: function() {
					// Build array of adjustments
					var adj = [
						{
							label: Ext.getCmp('rmv_cmp1_opt1_label_char').getValue(), // Adj Label
							values: [ // Array of adjustments for the label above
								Ext.getCmp('rmv_cmp1_opt1_adj_int').getValue(),
								Ext.getCmp('rmv_cmp2_opt1_adj_int').getValue(),
								Ext.getCmp('rmv_cmp3_opt1_adj_int').getValue()
							]
						},
						{
							label: Ext.getCmp('rmv_cmp1_opt2_label_char').getValue(),
							values: [
								Ext.getCmp('rmv_cmp1_opt2_adj_int').getValue(),
								Ext.getCmp('rmv_cmp2_opt2_adj_int').getValue(),
								Ext.getCmp('rmv_cmp3_opt2_adj_int').getValue()
							]
						}
					];

					// ----
					// Rules go here:

					var returnErrors = [];

					// Require label be selected for any adjustments with a value
					Ext.each(adj, function(adjustment, aIndex) { // Loop over each dynamic adjustment definition
						var hasLabel = !!adjustment.label;
						var maxAdj = 0;

						// Loop over all adj. values looking for anything > 0
						Ext.each(adjustment.values, function(value, vIndex) { // Find max adj value
							maxAdj = ( value && Math.abs(parseInt(value)) > maxAdj) ? Math.abs(parseInt(value)) : maxAdj;
						});

						if (maxAdj > 0 && !hasLabel) {
							returnErrors.push("No adjustment label selected for adjustment drop-down #" + (aIndex+1) + '. Please select an adjustment from the drop-down or remove all adjustments from that row.');
						}
					});

					if (returnErrors.length === 0) {
						return true;
					}

					return returnErrors;
				},
				requiredFiles: function () {
					var missingFiles = Ext.getCmp('form-rmv').getMissingRequiredFiles();

					if (missingFiles.length === 0) {
						return true;
					}

					var error = "Missing these required files:\n<ul>";
					for (var i=0; i<missingFiles.length; i++) {
						error += "<li>&nbsp;&nbsp;&bull;&nbsp;" + missingFiles[i] + "</li>";
					}
					error += "</ul>";
					return error;
				},
				realQuest: function () {
					var rqHigh   = Ext.getCmp('rmv_anc_rq_saleprice_highest').getValue(),
						rqLow    = Ext.getCmp('rmv_anc_rq_saleprice_lowest').getValue(),
						rmvValue = parseInt(Ext.getCmp('comments_rmv_concl_as_is_int').getValue()),
						comment  = Ext.getCmp('rmv_anc_bracketing_comment').getValue();
					
					if (!comment && (rmvValue > rqHigh || rmvValue < rqLow)) {
						Ext.getCmp('form-rmv').ancillaryDataChange();  // Trigger UI change in the off chance something went wrong
						return 'Please comment on why your concluded value is not bracketed by RealQuest.';
					}
					
					
					return true;
				}
			};

			if (Ext.getCmp('files_has_appraisal_wrapper').getValue()==1) {
				if (Ext.getCmp('rmv_bpo_review_apprwrpr_text').getValue().length < 25) {
					retval = false;
					errors.push("This order has an Appraisal Wrapper / GAAR / ACRP that needs to be reviewed and commented on. Detail any inconsistencies, deficiencies, and/or comment on the overall acceptability of the report as it relates the Appraisal conforming to Fannie/Freddie standards.");
				}
			}

			// ancillary data validation
			var ancRQLow = (Ext.isEmpty(Ext.getCmp('rmv_anc_rq_saleprice_lowest').getValue())) ? 0 : Ext.getCmp('rmv_anc_rq_saleprice_lowest').getValue();
			var ancRQHigh = (Ext.isEmpty(Ext.getCmp('rmv_anc_rq_saleprice_highest').getValue())) ? 0 : Ext.getCmp('rmv_anc_rq_saleprice_highest').getValue();
			var ancHPLow = (Ext.isEmpty(Ext.getCmp('rmv_anc_hpro_saleprice_lowest').getValue())) ? 0 : Ext.getCmp('rmv_anc_hpro_saleprice_lowest').getValue();
			var ancHPHigh = (Ext.isEmpty(Ext.getCmp('rmv_anc_hpro_saleprice_highest').getValue())) ? 0 : Ext.getCmp('rmv_anc_hpro_saleprice_highest').getValue();

			if (ancRQLow > ancRQHigh) {
				retval = false;
				errors.push('RealQuest Highest Price Sale must be greater than RealQuest Lowest Price Sale.');
			}

			if (ancHPLow > ancHPHigh) {
				retval = false;
				errors.push('History Pro Highest Price Sale must be greater than History Pro Lowest Price Sale.');
			}

			// validate prior rmv
			var dtToday = new Date();
			var dtCurrent = dtToday.add(Date.DAY, 1);
			var dtOneYearAgo = dtCurrent.add(Date.YEAR, -1);
			var dtPPO = Ext.getCmp('rmv_priormkt_prepared_date').getValue();
			var cmbSigChange = Ext.getCmp('rmv_prior_change_notes_text').getValue();

			if (Ext.isDate(dtPPO)) {
				if (true===dtPPO.between(dtOneYearAgo, dtCurrent) && cmbSigChange==='N/A') {
					//"Significant Change" must be either "No" or "Yes". Can not be N/A.
					// rmv_prior_change_notes_text != "N/A"
					retval = false;
					errors.push('Since "Prior Prep. On" is older than 1 year, "N/A" cannot be selected for "Significant Change."  Please select "Yes" or "No"');
				}
			}

			// validate prior variance
			var dpv = Ext.getCmp('derived_prior_variance').getValue();

			var priorOn = Ext.getCmp('rmv_priormkt_prepared_date').getValue();
			var sigChange = Ext.getCmp('rmv_prior_change_notes_text').getValue();
			var msElapsed = 0;
			var dt = new Date();
			var daysSincePrior = 0;
			var priorError = "The variance between the Prior RMV and the Reviewer's Reconciled Value is deemed 'Significant' based on the change in value over the respective time line. Please complete the 'Prior Reconciliation and Analysis' section accordingly and resubmit.";

			// cmp section
			var cmpSrc = 0;
			if (false===Ext.isEmpty(Ext.getCmp('rmv_cmp1_source_enum').getValue())) {
				cmpSrc++;
			}
			if (false===Ext.isEmpty(Ext.getCmp('rmv_cmp2_source_enum').getValue())) {
				cmpSrc++;
			}
			if (false===Ext.isEmpty(Ext.getCmp('rmv_cmp3_source_enum').getValue())) {
				cmpSrc++;
			}
			if (cmpSrc < 2) {
				retval = false;
				errors.push('At least 2 Comparable Evalutions must be provided.');
			}

			var cmpAdj = 0;
			var cmp1AdjValue = false;
			var cmp2AdjValue = false;
			var cmp3AdjValue = false;
			if (false===Ext.isEmpty(Ext.getCmp('rmv_cmp1_est_subject_value_int').getValue())) {
				cmp1AdjValue = Ext.getCmp('rmv_cmp1_est_subject_value_int').getValue();
				cmpAdj++;
			}
			if (false===Ext.isEmpty(Ext.getCmp('rmv_cmp2_est_subject_value_int').getValue())) {
				cmpAdj++;
				cmp2AdjValue = Ext.getCmp('rmv_cmp2_est_subject_value_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('rmv_cmp3_est_subject_value_int').getValue())) {
				cmpAdj++;
				cmp3AdjValue = Ext.getCmp('rmv_cmp3_est_subject_value_int').getValue();
			}
			if (cmpAdj < 2) {
				retval = false;
				errors.push('At least 2 Comparable Evalutions:Adjusted Values must be provided.');
			}

			var cmpCmt = 0;
			if (false===Ext.isEmpty(Ext.getCmp('rmv_cmp1_notes_text').getValue())) {
				cmpCmt++;
			}
			if (false===Ext.isEmpty(Ext.getCmp('rmv_cmp2_notes_text').getValue())) {
				cmpCmt++;
			}
			if (false===Ext.isEmpty(Ext.getCmp('rmv_cmp3_notes_text').getValue())) {
				cmpCmt++;
			}
			if (cmpCmt < 2) {
				retval = false;
				errors.push('At least 2 Comparable Evalutions:Comments must be provided.');
			}

			var assessChecked = false;
			if (Ext.getCmp('reconrmvassmt_nonegatives').getValue()===true) {
				assessChecked = true;
			} else {
				Ext.getCmp('chkgrp-assessment').items.each(function(item, index, length) {
					if (item.getValue()===true) {
						assessChecked = true;
					}
				});
			}

			if (false===assessChecked) {
				retval = false;
				errors.push('Most Recent BPO/Appraisal: You must choose at least one negative assessement or indicate no negative assessments were exhibited.');
			}

			if (Ext.getCmp('reconpriorbpo2_flag').getValue()==='1') {
				if (Ext.getCmp('reconpriorbpo2_review_assessment_enum').getValue()==='Unreliable') {
					var assessCheckedBPO2 = false;

					if (Ext.getCmp('reconpriorbpo2_assmt_compdst').getValue()===true) {
						assessCheckedBPO2 = true;
					}
					if (Ext.getCmp('reconpriorbpo2_assmt_inapprrprcnsd').getValue()===true) {
						assessCheckedBPO2 = true;
					}
					if (Ext.getCmp('reconpriorbpo2_assmt_conclunspt').getValue()===true) {
						assessCheckedBPO2 = true;
					}
					if (Ext.getCmp('reconpriorbpo2_assmt_sjbimprinacr').getValue()===true) {
						assessCheckedBPO2 = true;
					}
					if (Ext.getCmp('reconpriorbpo2_assmt_inapprcmps').getValue()===true) {
						assessCheckedBPO2 = true;
					}
					if (Ext.getCmp('reconpriorbpo2_assmt_sbjhstinacabs').getValue()===true) {
						assessCheckedBPO2 = true;
					}
					if (Ext.getCmp('reconpriorbpo2_assmt_dtdcmps').getValue()===true) {
						assessCheckedBPO2 = true;
					}
					if (Ext.getCmp('reconpriorbpo2_assmt_sjbcndinac').getValue()===true) {
						assessCheckedBPO2 = true;
					}
					if (Ext.getCmp('reconpriorbpo2_assmt_inacprptyp').getValue()===true) {
						assessCheckedBPO2 = true;
					}
					if (Ext.getCmp('reconpriorbpo2_assmt_inaclstpr').getValue()===true) {
						assessCheckedBPO2 = true;
					}
					if (Ext.getCmp('reconpriorbpo2_assmt_incabsphts').getValue()===true) {
						assessCheckedBPO2 = true;
					}
					if (Ext.getCmp('reconpriorbpo2_assmt_inadexpl').getValue()===true) {
						assessCheckedBPO2 = true;
					}
					if (Ext.getCmp('reconpriorbpo2_assmt_sbjstinflinac').getValue()===true) {
						assessCheckedBPO2 = true;
					}
					if (Ext.getCmp('reconpriorbpo2_assmt_incsbjprop').getValue()===true) {
						assessCheckedBPO2 = true;
					}
					if (Ext.getCmp('reconpriorbpo2_assmt_slsfacts').getValue()===true) {
						assessCheckedBPO2 = true;
					}
					if (Ext.getCmp('reconpriorbpo2_assmt_sjbglainac').getValue()===true) {
						assessCheckedBPO2 = true;
					}

					if (false===assessCheckedBPO2) {
						retval = false;
						errors.push('BPO/Appraisal 2 Review: Assessment is marked Unreliable.  Make sure at least 1 checkbox is checked.');
					}
				}
			}

			if (Ext.getCmp('reconpriorbpo3_flag').getValue()==='1') {
				if (Ext.getCmp('reconpriorbpo3_review_assessment_enum').getValue()==='Unreliable') {
					var assessCheckedBPO3 = false;

					if (Ext.getCmp('reconpriorbpo3_assmt_compdst').getValue()===true) {
						assessCheckedBPO3 = true;
					}
					if (Ext.getCmp('reconpriorbpo3_assmt_inapprrprcnsd').getValue()===true) {
						assessCheckedBPO3 = true;
					}
					if (Ext.getCmp('reconpriorbpo3_assmt_conclunspt').getValue()===true) {
						assessCheckedBPO3 = true;
					}
					if (Ext.getCmp('reconpriorbpo3_assmt_sjbimprinacr').getValue()===true) {
						assessCheckedBPO3 = true;
					}
					if (Ext.getCmp('reconpriorbpo3_assmt_inapprcmps').getValue()===true) {
						assessCheckedBPO3 = true;
					}
					if (Ext.getCmp('reconpriorbpo3_assmt_sbjhstinacabs').getValue()===true) {
						assessCheckedBPO3 = true;
					}
					if (Ext.getCmp('reconpriorbpo3_assmt_dtdcmps').getValue()===true) {
						assessCheckedBPO3 = true;
					}
					if (Ext.getCmp('reconpriorbpo3_assmt_sjbcndinac').getValue()===true) {
						assessCheckedBPO3 = true;
					}
					if (Ext.getCmp('reconpriorbpo3_assmt_inacprptyp').getValue()===true) {
						assessCheckedBPO3 = true;
					}
					if (Ext.getCmp('reconpriorbpo3_assmt_inaclstpr').getValue()===true) {
						assessCheckedBPO3 = true;
					}
					if (Ext.getCmp('reconpriorbpo3_assmt_incabsphts').getValue()===true) {
						assessCheckedBPO3 = true;
					}
					if (Ext.getCmp('reconpriorbpo3_assmt_inadexpl').getValue()===true) {
						assessCheckedBPO3 = true;
					}
					if (Ext.getCmp('reconpriorbpo3_assmt_sbjstinflinac').getValue()===true) {
						assessCheckedBPO3 = true;
					}
					if (Ext.getCmp('reconpriorbpo3_assmt_incsbjprop').getValue()===true) {
						assessCheckedBPO3 = true;
					}
					if (Ext.getCmp('reconpriorbpo3_assmt_slsfacts').getValue()===true) {
						assessCheckedBPO3 = true;
					}
					if (Ext.getCmp('reconpriorbpo3_assmt_sjbglainac').getValue()===true) {
						assessCheckedBPO3 = true;
					}

					if (false===assessCheckedBPO3) {
						retval = false;
						errors.push('BPO/Appraisal 3 Review: Assessment is marked Unreliable.  Make sure at least 1 checkbox is checked.');
					}
				}
			}

			if (Ext.getCmp('reconpriorbpo4_flag').getValue()==='1') {
				if (Ext.getCmp('reconpriorbpo4_review_assessment_enum').getValue()==='Unreliable') {
					var assessCheckedBPO4 = false;

					if (Ext.getCmp('reconpriorbpo4_assmt_compdst').getValue()===true) {
						assessCheckedBPO4 = true;
					}
					if (Ext.getCmp('reconpriorbpo4_assmt_inapprrprcnsd').getValue()===true) {
						assessCheckedBPO4 = true;
					}
					if (Ext.getCmp('reconpriorbpo4_assmt_conclunspt').getValue()===true) {
						assessCheckedBPO4 = true;
					}
					if (Ext.getCmp('reconpriorbpo4_assmt_sjbimprinacr').getValue()===true) {
						assessCheckedBPO4 = true;
					}
					if (Ext.getCmp('reconpriorbpo4_assmt_inapprcmps').getValue()===true) {
						assessCheckedBPO4 = true;
					}
					if (Ext.getCmp('reconpriorbpo4_assmt_sbjhstinacabs').getValue()===true) {
						assessCheckedBPO4 = true;
					}
					if (Ext.getCmp('reconpriorbpo4_assmt_dtdcmps').getValue()===true) {
						assessCheckedBPO4 = true;
					}
					if (Ext.getCmp('reconpriorbpo4_assmt_sjbcndinac').getValue()===true) {
						assessCheckedBPO4 = true;
					}
					if (Ext.getCmp('reconpriorbpo4_assmt_inacprptyp').getValue()===true) {
						assessCheckedBPO4 = true;
					}
					if (Ext.getCmp('reconpriorbpo4_assmt_inaclstpr').getValue()===true) {
						assessCheckedBPO4 = true;
					}
					if (Ext.getCmp('reconpriorbpo4_assmt_incabsphts').getValue()===true) {
						assessCheckedBPO4 = true;
					}
					if (Ext.getCmp('reconpriorbpo4_assmt_inadexpl').getValue()===true) {
						assessCheckedBPO4 = true;
					}
					if (Ext.getCmp('reconpriorbpo4_assmt_sbjstinflinac').getValue()===true) {
						assessCheckedBPO4 = true;
					}
					if (Ext.getCmp('reconpriorbpo4_assmt_incsbjprop').getValue()===true) {
						assessCheckedBPO4 = true;
					}
					if (Ext.getCmp('reconpriorbpo4_assmt_slsfacts').getValue()===true) {
						assessCheckedBPO4 = true;
					}
					if (Ext.getCmp('reconpriorbpo4_assmt_sjbglainac').getValue()===true) {
						assessCheckedBPO4 = true;
					}

					if (false===assessCheckedBPO4) {
						retval = false;
						errors.push('BPO/Appraisal 4 Review: Assessment is marked Unreliable.  Make sure at least 1 checkbox is checked.');
					}
				}
			}
			////////////////////////////////






			if (true===Ext.isEmpty(Ext.getCmp('comments_rmv_concl_as_is_int').getValue())) {
				retval = false;
				errors.push('Recon Comments: As Is is a required field.');
			} else {
				// cannot exceed 999,999
				if (Ext.getCmp('comments_rmv_concl_as_is_int').getValue() > 999999) {
					retval = false;
					errors.push('"Recon Comments: As Is" cannot exceed $999,999.');
				}
			}

			if (true===Ext.isEmpty(Ext.getCmp('comments_rmv_concl_as_repaired_int').getValue())) {
				retval = false;
				errors.push('Recon Comments: As Repaired is a required field.');
			} else {
				// cannot exceed 999,999
				if (Ext.getCmp('comments_rmv_concl_as_repaired_int').getValue() > 999999) {
					retval = false;
					errors.push('"Recon Comments: As Repaired" cannot exceed $999,999.');
				}
			}

			if (true===Ext.isEmpty(Ext.getCmp('comments_rmv_concl_repair_cost_int').getValue())) {
				retval = false;
				errors.push('Recon Comments: Repair Cost is a required field.');
			}

			if (true===Ext.isEmpty(Ext.getCmp('recon_comments_text').getValue())) {
				retval = false;
				errors.push('Recon Comments: You must provide comments.');
			}

			// validate repairs
			var rpramt = 0;
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_structural_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_structural_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_roof_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_roof_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_windr_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_windr_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_painting_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_painting_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_sidingtrim_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_sidingtrim_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_landscape_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_landscape_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_garage_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_garage_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_poolspa_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_poolspa_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_outblds_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_outblds_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_trash_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_trash_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_trmpstdmg_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_trmpstdmg_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_plmbfxt_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_plmbfxt_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_flrcpt_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_flrcpt_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_wallsclg_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_wallsclg_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_util_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_util_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_appls_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_appls_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_cabcarp_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_cabcarp_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_other1value_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_other1value_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_other2value_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_other2value_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_intpnt_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_intpnt_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_electrical_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_electrical_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_hvac_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_hvac_int').getValue();
			}
			if (false===Ext.isEmpty(Ext.getCmp('reconrpradd_mold_int').getValue())) {
				rpramt += Ext.getCmp('reconrpradd_mold_int').getValue();
			}

			var rprCost = parseInt(Ext.getCmp('comments_rmv_concl_repair_cost_int').getValue(), 10);
			var rprAsIs = parseInt(Ext.getCmp('comments_rmv_concl_as_is_int').getValue(), 10);
			var rprAsRepaired = parseInt(Ext.getCmp('comments_rmv_concl_as_repaired_int').getValue(), 10);
			isRepairError = false;

			if (rprCost != rpramt) {
				isRepairError = true;
			}

			var destVendor = Ext.getCmp('reconvalarc_DestVendor_char').getValue();
			if (rprCost > 0) {
				var rprFactor = (destVendor=='LPS') ? 2 : 1;
				if (rprAsRepaired > (rprAsIs + rprFactor*rprCost)) {
					isRepairError = true;
				}
			}

			if (rprCost == 0) {
				if (rprAsRepaired != rprAsIs) {
					isRepairError = true;
				}
			}

			if (true===isRepairError) {
				retval = false;
				errors.push('Your concluded repair values are inconsistent, please revise them as appropriate.');
			}
			if (Ext.getCmp('files_has_research').getValue() < 1 && !isRemoteAccessSession) {
				retval = false;
				errors.push('You must upload at least 1 research file.');
			}

			//rmv_prop_defmaint_char
			if (Ext.getCmp('rmv_prop_defmaint_char').getValue()==='Yes' && rprCost===0) {
				retval = false;
				errors.push('"Repair Cost" must be greater than zero when "Deferred Maintenance" is "Yes"');
			}


			// validate cmp section

			// As Is (rprAsIs - comments_rmv_concl_as_is_int) must be between min/max of comp adj values
			// cmp1AdjValue, cmp2AdjValue, cmp3AdjValue
			// the As Is within the reconiliation comments must be within the min max these values
			var adjNumbers = [];
			if (cmp1AdjValue!==false && Ext.isNumber(cmp1AdjValue)) {
				adjNumbers.push(cmp1AdjValue);
			}
			if (cmp2AdjValue!==false && Ext.isNumber(cmp2AdjValue)) {
				adjNumbers.push(cmp2AdjValue);
			}
			if (cmp3AdjValue!==false && Ext.isNumber(cmp3AdjValue)) {
				adjNumbers.push(cmp3AdjValue);
			}
			var minAdjValue = Ext.min(adjNumbers);
			var maxAdjValue = Ext.max(adjNumbers);
			if (Ext.isNumber(minAdjValue) && Ext.isNumber(maxAdjValue) && Ext.isNumber(rprAsIs)) {
				if ( (rprAsIs < minAdjValue) || (rprAsIs > maxAdjValue) ) {
					retval = false;
					errors.push('The "As Is" value must be within the min and max comp adjusted values.');
				}
			}

			/*
				take the highest value from cmp1AdjValue, cmp2AdjValue, cmp3AdjValue
				the the lowest value from cmp1AdjValue, cmp2AdjValue, cmp3AdjValue
				((highestcompvalue-lowestcompvalue)/highestcompvalue)*100 == your variance range
				if the variance range is greater than 15 show an error
				absolute the value, so you treat negative and positive #s the same
			*/
			var cmpVariance = 0;
			var cmpVarianceLimit = 15;
			// FMV has higher limit
			if (Ext.getCmp('fairMarketCommentsColumn').isVisible()) {
				cmpVarianceLimit = 40;
			}
			if (Ext.isNumber(minAdjValue) && Ext.isNumber(maxAdjValue)) {
				if (maxAdjValue > 0) {
					cmpVariance = Math.abs(((maxAdjValue-minAdjValue)/maxAdjValue) * 100);
				}
				//console.log('cmpVariance', cmpVariance);
			}
			if (cmpVariance > cmpVarianceLimit) {
				retval = false;
				errors.push('The variance between the lowest adjusted comp sale and the highest adjusted comp sale is too great. The value variance between the lowest comp sale and the highest comp sale must not exceed ' + cmpVarianceLimit + '%.');
			}

			// IF GLA more than 10% different than Subj. GLA require adjustment
			// Formula %Error = Experimantal Value (comp) - Accepted Value (Property Value) / Accepted Value * 100
			var sbjGLA = Ext.getCmp('rmv_prop_sq_feet_float').getValue();
			var cmp1GLA = Ext.getCmp('rmv_cmp1_gla_char').getValue();
			var cmp2GLA = Ext.getCmp('rmv_cmp2_gla_char').getValue();
			var cmp3GLA = Ext.getCmp('rmv_cmp3_gla_char').getValue();
			var cmp1GLAValAdj = Ext.getCmp('rmv_cmp1_gla_adj_int').getValue();
			var cmp2GLAValAdj = Ext.getCmp('rmv_cmp2_gla_adj_int').getValue();
			var cmp3GLAValAdj = Ext.getCmp('rmv_cmp3_gla_adj_int').getValue();
			var cmp1GLADiff = Math.abs(((cmp1GLA-sbjGLA)/sbjGLA)*100);
			var cmp2GLADiff = Math.abs(((cmp2GLA-sbjGLA)/sbjGLA)*100);
			var cmp3GLADiff = Math.abs(((cmp3GLA-sbjGLA)/sbjGLA)*100);
			if (cmp1GLA.length > 0 && cmp1GLADiff > 10 && (Ext.isEmpty(cmp1GLAValAdj) || cmp1GLAValAdj===0) ) {
				retval = false;
				errors.push('Comp 1 "GLA" adjusted value required since it differs by more than 10% of Subject GLA.');
			}
			if (cmp2GLA.length > 0 && cmp2GLADiff > 10 && (Ext.isEmpty(cmp2GLAValAdj) || cmp2GLAValAdj===0) ) {
				retval = false;
				errors.push('Comp 2 "GLA" adjusted value required since it differs by more than 10% of Subject GLA.');
			}
			if (cmp3GLA.length > 0 && cmp3GLADiff > 10 && (Ext.isEmpty(cmp3GLAValAdj) || cmp3GLAValAdj===0) ) {
				retval = false;
				errors.push('Comp 3 "GLA" adjusted value required since it differs by more than 10% of Subject GLA.');
			}

			// IF beds different than more than 1 than subject, adjusted required
			var sbjBeds = Ext.getCmp('rmv_prop_num_bedrooms_int').getValue();
			var cmp1Src = Ext.getCmp('rmv_cmp1_source_enum').getValue();
			var cmp2Src = Ext.getCmp('rmv_cmp2_source_enum').getValue();
			var cmp3Src = Ext.getCmp('rmv_cmp3_source_enum').getValue();

			if (cmp1Src===null) {
				cmp1Src = '';
			}
			if (cmp2Src===null) {
				cmp2Src = '';
			}
			if (cmp3Src===null) {
				cmp3Src = '';
			}

			var cmp1Beds = Ext.getCmp('rmv_cmp1_beds_int').getValue();
			var cmp1BedsAdj = Ext.getCmp('rmv_cmp1_beds_adj_int').getValue();
			var cmp1BedsDiff = Math.abs(sbjBeds - cmp1Beds);
			if (cmp1Src.length > 0 && cmp1BedsDiff > 1 && (Ext.isEmpty(cmp1BedsAdj) || cmp1BedsAdj===0) ) {
				retval = false;
				errors.push('Comp 1 "Beds" adjusted value required since it differs by more than 1 from the subject value.');
			}

			var cmp2Beds = Ext.getCmp('rmv_cmp2_beds_int').getValue();
			var cmp2BedsAdj = Ext.getCmp('rmv_cmp2_beds_adj_int').getValue();
			var cmp2BedsDiff = Math.abs(sbjBeds - cmp2Beds);
			if (cmp2Src.length > 0 && cmp2BedsDiff > 1 && (Ext.isEmpty(cmp2BedsAdj) || cmp2BedsAdj===0) ) {
				retval = false;
				errors.push('Comp 2 "Beds" adjusted value required since it differs by more than 1 from the subject value.');
			}

			var cmp3Beds = Ext.getCmp('rmv_cmp3_beds_int').getValue();
			var cmp3BedsAdj = Ext.getCmp('rmv_cmp3_beds_adj_int').getValue();
			var cmp3BedsDiff = Math.abs(sbjBeds - cmp3Beds);
			if (cmp3Src.length > 0 && cmp3BedsDiff > 1 && (Ext.isEmpty(cmp3BedsAdj) || cmp3BedsAdj===0) ) {
				retval = false;
				errors.push('Comp 3 "Beds" adjusted value required since it differs by more than 1 from the subject value.');
			}

			// IF baths different than more than 1 than subject, adjusted required
			var sbjBaths = Ext.getCmp('rmv_prop_num_baths_decimal').getValue();

			var cmp1Baths = Ext.getCmp('rmv_cmp1_baths_int').getValue();
			var cmp1BathsAdj = Ext.getCmp('rmv_cmp1_baths_adj_int').getValue();
			var cmp1BathsDiff = Math.abs(sbjBaths - cmp1Baths);
			if (cmp1Src.length > 0 && cmp1BathsDiff > 1 && (Ext.isEmpty(cmp1BathsAdj) || cmp1BathsAdj===0) ) {
				retval = false;
				errors.push('Comp 1 "Baths" adjusted value required since it differs by more than 1 from the subject value.');
			}

			var cmp2Baths = Ext.getCmp('rmv_cmp2_baths_int').getValue();
			var cmp2BathsAdj = Ext.getCmp('rmv_cmp2_baths_adj_int').getValue();
			var cmp2BathsDiff = Math.abs(sbjBaths - cmp2Baths);
			if (cmp2Src.length > 0 && cmp2BathsDiff > 1 && (Ext.isEmpty(cmp2BathsAdj) || cmp2BathsAdj===0) ) {
				retval = false;
				errors.push('Comp 2 "Baths" adjusted value required since it differs by more than 1 from the subject value.');
			}

			var cmp3Baths = Ext.getCmp('rmv_cmp3_baths_int').getValue();
			var cmp3BathsAdj = Ext.getCmp('rmv_cmp3_baths_adj_int').getValue();
			var cmp3BathsDiff = Math.abs(sbjBaths - cmp3Baths);
			if (cmp3Src.length > 0 && cmp3BathsDiff > 1 && (Ext.isEmpty(cmp3BathsAdj) || cmp3BathsAdj===0) ) {
				retval = false;
				errors.push('Comp 3 "Baths" adjusted value required since it differs by more than 1 from the subject value.');
			}

			if (Ext.getCmp('chkgrp-violotions').isVisible() && Ext.getCmp('origination_comments_section').isVisible()) {
				var nViolations = 0;
				if (Ext.getCmp('reconrmvvio_bad_data').getValue()===true) {
					nViolations++;
				}
				if (Ext.getCmp('reconrmvvio_fraud_sales').getValue()===true) {
					nViolations++;
				}
				if (Ext.getCmp('reconrmvvio_inappr_adj').getValue()===true) {
					nViolations++;
				}
				if (Ext.getCmp('reconrmvvio_inappr_comps').getValue()===true) {
					nViolations++;
				}
				if (Ext.getCmp('reconrmvvio_incorrect_adj').getValue()===true) {
					nViolations++;
				}
				if (Ext.getCmp('reconrmvvio_incorrect_dist').getValue()===true) {
					nViolations++;
				}

				if (nViolations > 3) {
					retval = false;
					errors.push('You can only select a maximum of three Value Misrepresentation violations.');
				}
			}

			var fncFolder           = Ext.getCmp('recon_FNC_Folder_Num_varchar').getValue();
			var shortForm           = Ext.getCmp('rmv_short_form_enum').getValue();
			var hasResearch         = Ext.getCmp('files_has_research').getValue();
			var hasBPOResearch      = Ext.getCmp('files_has_bporesearch').getValue();
			var hasMiscResearch     = Ext.getCmp('files_has_miscresearch').getValue();
			var hasOAReasearch      = Ext.getCmp('files_has_oaresearch').getValue();
			var hasHistoryPro       = Ext.getCmp('files_has_hpro').getValue();
			var hasRQ               = Ext.getCmp('files_has_realquest').getValue();
			var hasRQCurrent        = Ext.getCmp('files_has_realquest_current').getValue();
			var rqCurrentCount      = Ext.getCmp('realquest_current_count').getValue();
			var hasOA               = Ext.getCmp('files_has_oa').getValue();

			var hasSubjectMLS = Ext.getCmp('files_has_subject_mls').getValue();
			var isSPO = Ext.getCmp('is_spo').getValue();

			var vv = Ext.getCmp('comments_value_variance').getValue();
			var bpoAssmt = Ext.getCmp('rmv_bpo_review_assessment_enum').getValue();
			if (Ext.isNumber(vv)) {
				vv = Math.abs(vv);
				if (vv > 20 && bpoAssmt==='Reliable') {
					retval = false;
					errors.push('The "Value Variance" between your concluded value and the Most Recent BPO is greater than 20%. Please mark the Most Recent BPO as Unreliable, and choose the appropriate reasons from the checkboxes.');
				}
			}

			if (Ext.getCmp('fs-spo-comments').isVisible()) {
				if (isSPO) {
					var spoComments = Ext.getCmp('rmv_spo_comments_text').getValue();
					if (spoComments.length < 50) {
						retval = false;
						errors.push("SPO Comments must be at least fifty characters long.");
					}
				}
			}

			var mirrionerror = 'Please stop your review and contact your manager to create an exception for this order. DO NOT PROCEED FURTHER!';
			if (Ext.isNumber(Ext.getCmp('rmv_bpo_review_90_as_is_int').getValue())) {
				if (Ext.getCmp('rmv_bpo_review_90_as_is_int').getValue() > 1000000) {
					retval = false;
					errors.push(mirrionerror);
				}
			}

			if (Ext.isNumber(Ext.getCmp('reconpriorbpo2_review_90_as_is_int').getValue())) {
				if (Ext.getCmp('reconpriorbpo2_review_90_as_is_int').getValue() > 1000000) {
					retval = false;
					errors.push(mirrionerror);
				}
			}

			if (Ext.isNumber(Ext.getCmp('reconpriorbpo3_review_90_as_is_int').getValue())) {
				if (Ext.getCmp('reconpriorbpo3_review_90_as_is_int').getValue() > 1000000) {
					retval = false;
					errors.push(mirrionerror);
				}
			}

			if (Ext.isNumber(Ext.getCmp('reconpriorbpo4_review_90_as_is_int').getValue())) {
				if (Ext.getCmp('reconpriorbpo4_review_90_as_is_int').getValue() > 1000000) {
					retval = false;
					errors.push(mirrionerror);
				}
			}

			// rmv_misrep_notes_text
			if (Ext.getCmp('origination_comments_section').isVisible()) {
				var strMisRepComments = Ext.getCmp('rmv_misrep_notes_text').getValue();
				if (strMisRepComments.indexOf('misrepresentation')  > -1) {
					retval = false;
					errors.push('Please review "Original Appraisal Integrity Review Comments". DO NOT use the words "value misrepresentation".');
				}
			}

			var amtErrorMsg = 'The concluded value is $500,000 or greater, and the order requires 3 comps prior to submitting. Please add an additional comp then resubmit order.';
			var amtThreshold = 499999;
			var isCompAmtError = false;
			var amtOrig = (Ext.isNumber(Ext.getCmp('rmv_orig_amount_int').getValue())) ? Ext.getCmp('rmv_orig_amount_int').getValue() : 0;
			var amtOrigAppr = (Ext.isNumber(Ext.getCmp('rmv_orig_app_value_int').getValue())) ? Ext.getCmp('rmv_orig_app_value_int').getValue() : 0;
			var amtBPO1AsIs = (Ext.isNumber(Ext.getCmp('rmv_bpo_review_90_as_is_int').getValue())) ? Ext.getCmp('rmv_bpo_review_90_as_is_int').getValue() : 0;
			var amtBPO1Rep = (Ext.isNumber(Ext.getCmp('rmv_bpo_review_90_as_rep_int').getValue())) ? Ext.getCmp('rmv_bpo_review_90_as_rep_int').getValue() : 0;
			var amtBPO2AsIs = (Ext.isNumber(Ext.getCmp('reconpriorbpo2_review_90_as_is_int').getValue())) ? Ext.getCmp('reconpriorbpo2_review_90_as_is_int').getValue() : 0;
			var amtBPO2Rep = (Ext.isNumber(Ext.getCmp('reconpriorbpo2_review_90_as_rep_int').getValue())) ? Ext.getCmp('reconpriorbpo2_review_90_as_rep_int').getValue() : 0;
			var amtBPO3AsIs = (Ext.isNumber(Ext.getCmp('reconpriorbpo3_review_90_as_is_int').getValue())) ? Ext.getCmp('reconpriorbpo3_review_90_as_is_int').getValue() : 0;
			var amtBPO3Rep = (Ext.isNumber(Ext.getCmp('reconpriorbpo3_review_90_as_rep_int').getValue())) ? Ext.getCmp('reconpriorbpo3_review_90_as_rep_int').getValue() : 0;
			var amtConclAsIs = (Ext.isNumber(Ext.getCmp('comments_rmv_concl_as_is_int').getValue())) ? Ext.getCmp('comments_rmv_concl_as_is_int').getValue() : 0;
			var amtConclAsRep = (Ext.isNumber(Ext.getCmp('comments_rmv_concl_as_repaired_int').getValue())) ? Ext.getCmp('comments_rmv_concl_as_repaired_int').getValue() : 0;

			var has3comps = false;
			if (cmp1Src.length > 0 && cmp2Src.length > 0 && cmp3Src.length > 0) {
				has3comps = true;
			}

			if (has3comps===false) {
				if (
					amtOrig > amtThreshold ||
					amtOrigAppr > amtThreshold ||
					amtBPO1AsIs > amtThreshold ||
					amtBPO1Rep > amtThreshold ||
					amtBPO2AsIs > amtThreshold ||
					amtBPO2Rep > amtThreshold ||
					amtBPO3AsIs > amtThreshold ||
					amtBPO3Rep > amtThreshold ||
					amtConclAsIs > amtThreshold ||
					amtConclAsRep > amtThreshold
				) {
					isCompAmtError = true;
				}
			}

			if (isCompAmtError===true) {
				retval = false;
				errors.push(amtErrorMsg);
			}

			var adjErrors = validators.dynamicAdj();
			if (adjErrors.constructor == Array) {
				errors = errors.concat(adjErrors);
			}

			var filesErrors = validators.requiredFiles();
			if (filesErrors !== true) {
				errors.push(filesErrors);
			}
			
			if (rqCurrentCount > 1) {
				errors.push('More than one (1) "RealQuest Current" file uploaded. More than one is not permitted.  Please contact your manager for assistance.');
			}
			
			// Trac #1213 
			var rqBracketingError = validators.realQuest();
			if (rqBracketingError !== true) {
				errors.push(rqBracketingError);
			}

			// Gmap Related Validation
			var gmapClicked = Ext.getCmp('rmv_gmap_clicked_int').getValue();
			if (gmapClicked == 0) {
				errors.push('Please make sure you open the Google Map link');
			}

			if (Ext.getCmp('opt-gmap-display-property-yes').getValue()===true) {

				var rowChecked = false;
				var gmapOptionsComplete = false;

				Ext.getCmp('fieldset-ppty-influences').items.each(function(item, index, length) {

					if (item.xtype == 'checkbox' && item.id != 'opt-gmap-noexinfluences') {
						rowChecked = item.getValue();
					}

					if (item.xtype == 'radiogroup' && rowChecked === true) {
						if (item.items.items[0].getValue()===false && item.items.items[1].getValue()===false) {
							errors.push('Map Options: each selected factor must have at least one option (No|Yes) selected');
						} else {
							gmapOptionsComplete = true;
						}
						rowChecked = false;
					}

				});

				if (gmapOptionsComplete === false && Ext.getCmp('opt-gmap-noexinfluences').getValue() === false) {
					errors.push('Google Map Options: At least one factor must be selected');
				}
			}

			if (Ext.getCmp('opt-gmap-display-property-no').getValue() === false && Ext.getCmp('opt-gmap-display-property-yes').getValue() === false) {
				errors.push('Comments on Subject Property Neighborhood: You must check the subject property map option');
			}

			// Only allow "Near Golf Course" -OR- "On Golf Course", not both
			var onGolfCourse = Ext.getCmp('opt-gmap-neargolf').getValue(); // boolean
			var nearGolfCourse = Ext.getCmp('opt-gmap-golfon').getValue(); // boolean
			if (onGolfCourse && nearGolfCourse) {
				errors.push('Google Map Options: You may not select BOTH "Property near golf course" AND "Property on golf course". Please select only one.');
			}

			// Only allow "Near Water" -OR- "Waterfront", not both
			var nearWater = Ext.getCmp('opt-gmap-nearwater').getValue(); // boolean
			var waterFront = Ext.getCmp('opt-gmap-waterfront').getValue(); // boolean
			if (nearWater && waterFront) {
				errors.push('Google Map Options: You may not select BOTH "Property near water" AND "Property is waterfront". Please select only one.');
			}

			// DOM from Property Details::Market Data/Conditions must 
			// validate against the bottom panel's FMV::Days To Sell
			var rmvDOM = Ext.getCmp('rmv_prop_days_on_market_enum').getValue();
			var fmvDTS = Ext.getCmp('comments_rmv_concl_fmv_estimateddaystosell_char').getValue();
			var hasDOMError = false;
			switch (fmvDTS) {
				case '120-180 days':
				case '180-240 days':
				case '240-300 days':
				case '300-360 days':
				case 'Greater than 360 days':
					if (rmvDOM !== 'Greater 120') {
						hasDOMError = true;
					}
					break;

				case '0-90 days':
					if (rmvDOM !== 'Less than 90') {
						hasDOMError = true;
					}
					break;

				case '90-120 days':
					if (rmvDOM !== '90 - 120') {
						hasDOMError = true;
					}
					break;

				default:
					hasDOMError = true;
					break;
			}

			if (hasDOMError) {
				errors.push('Property Details Market Data "Days on Market" must coincide with the Fair Market Values Days to Sell.');
			}

			// Most Recent BPO - Appraiser / Vendor names should NOT match
			var vendorName = Ext.getCmp('rmv_bpo_review_vendor_char').getValue();
			var agentName = Ext.getCmp('rmv_bpo_review_agent_appraiser_char').getValue();
			if (vendorName.toLowerCase()===agentName.toLowerCase()) {
				errors.push('Most Recent BPO: Vendor and Agent/Appraiser should not be the same.');
			}

			//errors.push('Debugging....');

			return errors;
		},

		saveData: function(btn) {
			Ext.get(Ext.getBody()).mask('Saving data...');
			var fm = this.getForm();
			if (fm.isValid()) {
				fm.submit({
					//clientValidation: true,
					scope: this,
					success: function(form, result) {
						Ext.getBody().unmask();

						var Response = Ext.decode(result.response.responseText);
						if (Response.success===true) {
							// reload grid, maintain selected row
							if (Ext.getCmp('grid-qa-queue')) {
								Ext.getCmp('grid-qa-queue').reloadData();
							}

							Ext.Msg.alert('Success', Response.message);
						} else {
							Ext.Msg.alert('Failure', Response.message);
						}

						//?? Ext.getCmp('form-recon-comments').submitRecon();
					},
					failure: function(form, result) {
						Ext.getBody().unmask();
						var Response = Ext.decode(result.response.responseText);
						Ext.Msg.alert('Failure', Response.message);
					}
				});
			} else {
				Ext.getBody().unmask();
				Ext.Msg.alert('Please check highlighted fields for errors.');
			}
		},

		updateRealQuestPro: function(record) {
			if ( record.json.realquestpro_compDetail_req ) {

				var rq = Ext.util.JSON.decode(record.json.realquestpro_compDetail_req);

				if (rq && rq['num_comps']) {
					var rq_str = "RealQuest report provided "+ rq['num_comps']+" sales";
					if (rq['comp_low'] && rq['comp_high'] && rq['comp_avg']) {
						rq_str += " ranging from $"+rq['comp_low']+" to $"+rq['comp_high']+" with average of $"+rq['comp_avg'];
					}
					if (rq['distfromsubj']) {
						rq_str += " within " + rq['distfromsubj'] + " mile(s)";
					}
					if (rq['monthsback']) {
						rq_str += ", " + rq['monthsback'] + " months";
					}
					if (rq['pcnt_lotsize']) {
						rq_str += ", " + rq['pcnt_lotsize'] + "% Lot size";
					}
					if (rq['livingareavariancepercent']) {
						rq_str += " & " + rq['livingareavariancepercent'] + "%+/- GLA\n";
					}

					Ext.getCmp('rqpro_criteria_text').setValue(rq_str);
				} else {
					Ext.getCmp('rqpro_criteria_text').setValue('N/A');
				}
			} else {
				Ext.getCmp('rqpro_criteria_text').setValue('N/A');
			}
		},

		updateViolations: function (record) {
			if (record.data.reconrmvvio_reconid_int) {
				if (record.data.rmv_misrep_violations_enum == 'Yes') {
					Ext.getCmp('rmv_misrep_violations_enum').setValue('Yes');
					Ext.getCmp('fs-chkgrp-violations').show();
					Ext.getCmp('chkgrp-violotions').enable();

					Ext.getCmp('reconrmvvio_bad_data').setValue(record.data.reconrmvvio_bad_data);
					Ext.getCmp('reconrmvvio_fraud_sales').setValue(record.data.reconrmvvio_fraud_sales);
					Ext.getCmp('reconrmvvio_inappr_adj').setValue(record.data.reconrmvvio_inappr_adj);
					Ext.getCmp('reconrmvvio_inappr_comps').setValue(record.data.reconrmvvio_inappr_comps);
					Ext.getCmp('reconrmvvio_incorrect_adj').setValue(record.data.reconrmvvio_incorrect_adj);
					Ext.getCmp('reconrmvvio_incorrect_dist').setValue(record.data.reconrmvvio_incorrect_dist);
				} else {
					Ext.getCmp('rmv_misrep_violations_enum').setValue('No');
				}
			} else {
				Ext.getCmp('rmv_misrep_violations_enum').setValue('No');
				Ext.getCmp('fs-chkgrp-violations').hide();
				Ext.getCmp('chkgrp-violotions').disable();
			}
		},

		updateAssessments: function (record) {			
			// handle legacy orders
			// -- set default to Reliable if existing order is Reliable, otherwise
			// set it to Unreliable if it's NULL or Unreliable
			var assessmentValue = 'Unreliable';
			//console.log(record.data.rmv_bpo_review_assessment_enum);
			if (record.data.rmv_bpo_review_assessment_enum == 'Reliable') {
				assessmentValue = 'Reliable';
				Ext.getCmp('reconrmvassmt_nonegatives').setValue(true);
			}

			Ext.getCmp('rmv_bpo_review_assessment_enum').setValue(assessmentValue);

			if (record.data.reconrmvassmt_reconid_int) {
				Ext.getCmp('reconrmvassmt_compdst').setValue(record.data.reconrmvassmt_compdst);
				Ext.getCmp('reconrmvassmt_inapprrprcnsd').setValue(record.data.reconrmvassmt_inapprrprcnsd);
				Ext.getCmp('reconrmvassmt_conclunspt').setValue(record.data.reconrmvassmt_conclunspt);
				Ext.getCmp('reconrmvassmt_sjbimprinacr').setValue(record.data.reconrmvassmt_sjbimprinacr);
				Ext.getCmp('reconrmvassmt_inapprcmps').setValue(record.data.reconrmvassmt_inapprcmps);
				Ext.getCmp('reconrmvassmt_sbjhstinacabs').setValue(record.data.reconrmvassmt_sbjhstinacabs);
				Ext.getCmp('reconrmvassmt_dtdcmps').setValue(record.data.reconrmvassmt_dtdcmps);
				Ext.getCmp('reconrmvassmt_sjbcndinac').setValue(record.data.reconrmvassmt_sjbcndinac);
				Ext.getCmp('reconrmvassmt_inacprptyp').setValue(record.data.reconrmvassmt_inacprptyp);
				Ext.getCmp('reconrmvassmt_inaclstpr').setValue(record.data.reconrmvassmt_inaclstpr);
				Ext.getCmp('reconrmvassmt_incabsphts').setValue(record.data.reconrmvassmt_incabsphts);
				Ext.getCmp('reconrmvassmt_inadexpl').setValue(record.data.reconrmvassmt_inadexpl);
				Ext.getCmp('reconrmvassmt_sbjstinflinac').setValue(record.data.reconrmvassmt_sbjstinflinac);
				Ext.getCmp('reconrmvassmt_incsbjprop').setValue(record.data.reconrmvassmt_incsbjprop);
				Ext.getCmp('reconrmvassmt_slsfacts').setValue(record.data.reconrmvassmt_slsfacts);
				Ext.getCmp('reconrmvassmt_sjbglainac').setValue(record.data.reconrmvassmt_sjbglainac);
				Ext.getCmp('reconrmvassmt_nonegatives').setValue(record.data.reconrmvassmt_nonegatives);

				if (record.data.reconrmvassmt_nonegatives == 1) {
					Ext.getCmp('rmv_bpo_review_assessment_enum').setValue('Reliable');
				}

				Ext.getCmp('chkgrp-assessment').items.each(function(item, index, length) {
					if (record.data.reconrmvassmt_nonegatives == 1) {
						item.disable();
						item.setValue(false);
					} else {
						item.enable();
					}
				});
			}
		},

		updateBPOAssessments: function(record) {
			Ext.getCmp('reconpriorbpo2_assmt_compdst').setValue(record.data.reconpriorbpo2_assmt_compdst);
			Ext.getCmp('reconpriorbpo2_assmt_inapprrprcnsd').setValue(record.data.reconpriorbpo2_assmt_inapprrprcnsd);
			Ext.getCmp('reconpriorbpo2_assmt_conclunspt').setValue(record.data.reconpriorbpo2_assmt_conclunspt);
			Ext.getCmp('reconpriorbpo2_assmt_sjbimprinacr').setValue(record.data.reconpriorbpo2_assmt_sjbimprinacr);
			Ext.getCmp('reconpriorbpo2_assmt_inapprcmps').setValue(record.data.reconpriorbpo2_assmt_inapprcmps);
			Ext.getCmp('reconpriorbpo2_assmt_sbjhstinacabs').setValue(record.data.reconpriorbpo2_assmt_sbjhstinacabs);
			Ext.getCmp('reconpriorbpo2_assmt_dtdcmps').setValue(record.data.reconpriorbpo2_assmt_dtdcmps);
			Ext.getCmp('reconpriorbpo2_assmt_sjbcndinac').setValue(record.data.reconpriorbpo2_assmt_sjbcndinac);
			Ext.getCmp('reconpriorbpo2_assmt_inaclstpr').setValue(record.data.reconpriorbpo2_assmt_inaclstpr);
			Ext.getCmp('reconpriorbpo2_assmt_incabsphts').setValue(record.data.reconpriorbpo2_assmt_incabsphts);
			Ext.getCmp('reconpriorbpo2_assmt_inadexpl').setValue(record.data.reconpriorbpo2_assmt_inadexpl);
			Ext.getCmp('reconpriorbpo2_assmt_sbjstinflinac').setValue(record.data.reconpriorbpo2_assmt_sbjstinflinac);
			Ext.getCmp('reconpriorbpo2_assmt_incsbjprop').setValue(record.data.reconpriorbpo2_assmt_incsbjprop);
			Ext.getCmp('reconpriorbpo2_assmt_slsfacts').setValue(record.data.reconpriorbpo2_assmt_slsfacts);
			Ext.getCmp('reconpriorbpo2_assmt_sjbglainac').setValue(record.data.reconpriorbpo2_assmt_sjbglainac);

			Ext.getCmp('reconpriorbpo3_assmt_compdst').setValue(record.data.reconpriorbpo3_assmt_compdst);
			Ext.getCmp('reconpriorbpo3_assmt_inapprrprcnsd').setValue(record.data.reconpriorbpo3_assmt_inapprrprcnsd);
			Ext.getCmp('reconpriorbpo3_assmt_conclunspt').setValue(record.data.reconpriorbpo3_assmt_conclunspt);
			Ext.getCmp('reconpriorbpo3_assmt_sjbimprinacr').setValue(record.data.reconpriorbpo3_assmt_sjbimprinacr);
			Ext.getCmp('reconpriorbpo3_assmt_inapprcmps').setValue(record.data.reconpriorbpo3_assmt_inapprcmps);
			Ext.getCmp('reconpriorbpo3_assmt_sbjhstinacabs').setValue(record.data.reconpriorbpo3_assmt_sbjhstinacabs);
			Ext.getCmp('reconpriorbpo3_assmt_dtdcmps').setValue(record.data.reconpriorbpo3_assmt_dtdcmps);
			Ext.getCmp('reconpriorbpo3_assmt_sjbcndinac').setValue(record.data.reconpriorbpo3_assmt_sjbcndinac);
			Ext.getCmp('reconpriorbpo3_assmt_inaclstpr').setValue(record.data.reconpriorbpo3_assmt_inaclstpr);
			Ext.getCmp('reconpriorbpo3_assmt_incabsphts').setValue(record.data.reconpriorbpo3_assmt_incabsphts);
			Ext.getCmp('reconpriorbpo3_assmt_inadexpl').setValue(record.data.reconpriorbpo3_assmt_inadexpl);
			Ext.getCmp('reconpriorbpo3_assmt_sbjstinflinac').setValue(record.data.reconpriorbpo3_assmt_sbjstinflinac);
			Ext.getCmp('reconpriorbpo3_assmt_incsbjprop').setValue(record.data.reconpriorbpo3_assmt_incsbjprop);
			Ext.getCmp('reconpriorbpo3_assmt_slsfacts').setValue(record.data.reconpriorbpo3_assmt_slsfacts);
			Ext.getCmp('reconpriorbpo3_assmt_sjbglainac').setValue(record.data.reconpriorbpo3_assmt_sjbglainac);

			Ext.getCmp('reconpriorbpo4_assmt_compdst').setValue(record.data.reconpriorbpo4_assmt_compdst);
			Ext.getCmp('reconpriorbpo4_assmt_inapprrprcnsd').setValue(record.data.reconpriorbpo4_assmt_inapprrprcnsd);
			Ext.getCmp('reconpriorbpo4_assmt_conclunspt').setValue(record.data.reconpriorbpo4_assmt_conclunspt);
			Ext.getCmp('reconpriorbpo4_assmt_sjbimprinacr').setValue(record.data.reconpriorbpo4_assmt_sjbimprinacr);
			Ext.getCmp('reconpriorbpo4_assmt_inapprcmps').setValue(record.data.reconpriorbpo4_assmt_inapprcmps);
			Ext.getCmp('reconpriorbpo4_assmt_sbjhstinacabs').setValue(record.data.reconpriorbpo4_assmt_sbjhstinacabs);
			Ext.getCmp('reconpriorbpo4_assmt_dtdcmps').setValue(record.data.reconpriorbpo4_assmt_dtdcmps);
			Ext.getCmp('reconpriorbpo4_assmt_sjbcndinac').setValue(record.data.reconpriorbpo4_assmt_sjbcndinac);
			Ext.getCmp('reconpriorbpo4_assmt_inaclstpr').setValue(record.data.reconpriorbpo4_assmt_inaclstpr);
			Ext.getCmp('reconpriorbpo4_assmt_incabsphts').setValue(record.data.reconpriorbpo4_assmt_incabsphts);
			Ext.getCmp('reconpriorbpo4_assmt_inadexpl').setValue(record.data.reconpriorbpo4_assmt_inadexpl);
			Ext.getCmp('reconpriorbpo4_assmt_sbjstinflinac').setValue(record.data.reconpriorbpo4_assmt_sbjstinflinac);
			Ext.getCmp('reconpriorbpo4_assmt_incsbjprop').setValue(record.data.reconpriorbpo4_assmt_incsbjprop);
			Ext.getCmp('reconpriorbpo4_assmt_slsfacts').setValue(record.data.reconpriorbpo4_assmt_slsfacts);
			Ext.getCmp('reconpriorbpo4_assmt_sjbglainac').setValue(record.data.reconpriorbpo4_assmt_sjbglainac);

		},

		updateCompAdj: function(record) {
			var cmp1adj = 0;
			var cmp2adj = 0;
			var cmp3adj = 0;

			var cmp1gla = parseInt(Ext.getCmp('rmv_cmp1_gla_adj_int').getValue(),10);
			var cmp1rooms = parseInt(Ext.getCmp('rmv_cmp1_rooms_adj_int').getValue(),10);
			var cmp1beds = parseInt(Ext.getCmp('rmv_cmp1_beds_adj_int').getValue(),10);
			var cmp1baths = parseInt(Ext.getCmp('rmv_cmp1_baths_adj_int').getValue(),10);
			var cmp1sldlst = parseInt(Ext.getCmp('rmv_cmp1_sldlst_adj_int').getValue(),10);
			var cmp1ltsz = parseInt(Ext.getCmp('rmv_cmp1_lotsize_adj_int').getValue(),10);
			var cmp1cnd = parseInt(Ext.getCmp('rmv_cmp1_condition_adj_int').getValue(),10);
			// drop down fields
			var cmp1opt1 = parseInt(Ext.getCmp('rmv_cmp1_opt1_adj_int').getValue(),10);
			var cmp1opt2 = parseInt(Ext.getCmp('rmv_cmp1_opt2_adj_int').getValue(),10);
			//var cmp1opt3 = parseInt(Ext.getCmp('rmv_cmp1_opt3_adj_int').getValue(),10);
			//var cmp1opt4 = parseInt(Ext.getCmp('rmv_cmp1_opt4_adj_int').getValue(),10);

			var cmp2gla = parseInt(Ext.getCmp('rmv_cmp2_gla_adj_int').getValue(),10);
			var cmp2rooms = parseInt(Ext.getCmp('rmv_cmp2_rooms_adj_int').getValue(),10);
			var cmp2beds = parseInt(Ext.getCmp('rmv_cmp2_beds_adj_int').getValue(),10);
			var cmp2baths = parseInt(Ext.getCmp('rmv_cmp2_baths_adj_int').getValue(),10);
			var cmp2sldlst = parseInt(Ext.getCmp('rmv_cmp2_sldlst_adj_int').getValue(),10);
			var cmp2ltsz = parseInt(Ext.getCmp('rmv_cmp2_lotsize_adj_int').getValue(),10);
			var cmp2cnd = parseInt(Ext.getCmp('rmv_cmp2_condition_adj_int').getValue(),10);
			// drop down fields
			var cmp2opt1 = parseInt(Ext.getCmp('rmv_cmp2_opt1_adj_int').getValue(),10);
			var cmp2opt2 = parseInt(Ext.getCmp('rmv_cmp2_opt2_adj_int').getValue(),10);
			//var cmp2opt3 = parseInt(Ext.getCmp('rmv_cmp2_opt3_adj_int').getValue(),10);
			//var cmp2opt4 = parseInt(Ext.getCmp('rmv_cmp2_opt4_adj_int').getValue(),10);

			var cmp3gla = parseInt(Ext.getCmp('rmv_cmp3_gla_adj_int').getValue(),10);
			var cmp3rooms = parseInt(Ext.getCmp('rmv_cmp3_rooms_adj_int').getValue(),10);
			var cmp3beds = parseInt(Ext.getCmp('rmv_cmp3_beds_adj_int').getValue(),10);
			var cmp3baths = parseInt(Ext.getCmp('rmv_cmp3_baths_adj_int').getValue(),10);
			var cmp3sldlst = parseInt(Ext.getCmp('rmv_cmp3_sldlst_adj_int').getValue(),10);
			var cmp3ltsz = parseInt(Ext.getCmp('rmv_cmp3_lotsize_adj_int').getValue(),10);
			var cmp3cnd = parseInt(Ext.getCmp('rmv_cmp3_condition_adj_int').getValue(),10);
			// drop down fields
			var cmp3opt1 = parseInt(Ext.getCmp('rmv_cmp3_opt1_adj_int').getValue(),10);
			var cmp3opt2 = parseInt(Ext.getCmp('rmv_cmp3_opt2_adj_int').getValue(),10);
			//var cmp3opt3 = parseInt(Ext.getCmp('rmv_cmp3_opt3_adj_int').getValue(),10);
			//var cmp3opt4 = parseInt(Ext.getCmp('rmv_cmp3_opt4_adj_int').getValue(),10);

			// cmp1
			if (cmp1gla > 0 || cmp1gla < 0) {
				cmp1adj += cmp1gla;
			} else {
				cmp1adj += 0;
			}

			if (cmp1rooms > 0 || cmp1rooms < 0) {
				cmp1adj += cmp1rooms;
			} else {
				cmp1adj += 0;
			}

			if (cmp1beds > 0 || cmp1beds < 0) {
				cmp1adj += cmp1beds;
			} else {
				cmp1adj += 0;
			}

			if (cmp1baths > 0 || cmp1baths < 0) {
				cmp1adj += cmp1baths;
			} else {
				cmp1adj += 0;
			}

			if (cmp1sldlst > 0 || cmp1sldlst < 0) {
				cmp1adj += cmp1sldlst;
			} else {
				cmp1adj += 0;
			}

			if (cmp1ltsz > 0 || cmp1ltsz < 0) {
				cmp1adj += cmp1ltsz;
			} else {
				cmp1adj += 0;
			}

			if (cmp1cnd > 0 || cmp1cnd < 0) {
				cmp1adj += cmp1cnd;
			} else {
				cmp1adj += 0;
			}
			// drop downs
			if (cmp1opt1 > 0 || cmp1opt1 < 0) {
				cmp1adj += cmp1opt1;
			} else {
				cmp1adj += 0;
			}

			if (cmp1opt2 > 0 || cmp1opt2 < 0) {
				cmp1adj += cmp1opt2;
			} else {
				cmp1adj += 0;
			}

			/*
			if (cmp1opt3 > 0 || cmp1opt3 < 0) {
				cmp1adj += cmp1opt3;
			} else {
				cmp1adj += 0;
			}

			if (cmp1opt4 > 0 || cmp1opt4 < 0) {
				cmp1adj += cmp1opt4;
			} else {
				cmp1adj += 0;
			}
			*/

			// cmp2
			if (cmp2gla > 0 || cmp2gla < 0) {
				cmp2adj += cmp2gla;
			} else {
				cmp2adj += 0;
			}

			if (cmp2rooms > 0 || cmp2rooms < 0) {
				cmp2adj += cmp2rooms;
			} else {
				cmp2adj += 0;
			}

			if (cmp2beds > 0 || cmp2beds < 0) {
				cmp2adj += cmp2beds;
			} else {
				cmp2adj += 0;
			}

			if (cmp2baths > 0 || cmp2baths < 0) {
				cmp2adj += cmp2baths;
			} else {
				cmp2adj += 0;
			}

			if (cmp2sldlst > 0 || cmp2sldlst < 0) {
				cmp2adj += cmp2sldlst;
			} else {
				cmp2adj += 0;
			}

			if (cmp2ltsz > 0 || cmp2ltsz < 0) {
				cmp2adj += cmp2ltsz;
			} else {
				cmp2adj += 0;
			}

			if (cmp2cnd > 0 || cmp2cnd < 0) {
				cmp2adj += cmp2cnd;
			} else {
				cmp2adj += 0;
			}

			// drop downs
			if (cmp2opt1 > 0 || cmp2opt1 < 0) {
				cmp2adj += cmp2opt1;
			} else {
				cmp2adj += 0;
			}

			if (cmp2opt2 > 0 || cmp2opt2 < 0) {
				cmp2adj += cmp2opt2;
			} else {
				cmp2adj += 0;
			}

			/*
			if (cmp2opt3 > 0 || cmp2opt3 < 0) {
				cmp2adj += cmp2opt3;
			} else {
				cmp2adj += 0;
			}

			if (cmp2opt4 > 0 || cmp2opt4 < 0) {
				cmp2adj += cmp2opt4;
			} else {
				cmp2adj += 0;
			}
			*/


			// cmp3
			if (cmp3gla > 0 || cmp3gla < 0) {
				cmp3adj += cmp3gla;
			} else {
				cmp3adj += 0;
			}

			if (cmp3rooms > 0 || cmp3rooms < 0) {
				cmp3adj += cmp3rooms;
			} else {
				cmp3adj += 0;
			}

			if (cmp3beds > 0 || cmp3beds < 0) {
				cmp3adj += cmp3beds;
			} else {
				cmp3adj += 0;
			}

			if (cmp3baths > 0 || cmp3baths < 0) {
				cmp3adj += cmp3baths;
			}

			if (cmp3sldlst > 0 || cmp3sldlst < 0) {
				cmp3adj += cmp3sldlst;
			} else {
				cmp3adj += 0;
			}

			if (cmp3ltsz > 0 || cmp3ltsz < 0) {
				cmp3adj += cmp3ltsz;
			} else {
				cmp3adj += 0;
			}

			if (cmp3cnd > 0 || cmp3cnd < 0) {
				cmp3adj += cmp3cnd;
			} else {
				cmp3adj += 0;
			}

			// drop downs
			if (cmp3opt1 > 0 || cmp3opt1 < 0) {
				cmp3adj += cmp3opt1;
			} else {
				cmp3adj += 0;
			}

			if (cmp3opt2 > 0 || cmp3opt2 < 0) {
				cmp3adj += cmp3opt2;
			} else {
				cmp3adj += 0;
			}

			/*
			if (cmp3opt3 > 0 || cmp3opt3 < 0) {
				cmp3adj += cmp3opt3;
			} else {
				cmp3adj += 0;
			}

			if (cmp3opt4 > 0 || cmp3opt4 < 0) {
				cmp3adj += cmp3opt4;
			} else {
				cmp3adj += 0;
			}
			*/

			Ext.getCmp('cmp1_adj_col2').setValue(cmp1adj);
			Ext.getCmp('cmp2_adj_col2').setValue(cmp2adj);
			Ext.getCmp('cmp3_adj_col2').setValue(cmp3adj);

			var comp1adjval = 0;
			var comp2adjval = 0;
			var comp3adjval = 0;

			var cmp1value = parseInt(Ext.getCmp('rmv_cmp1_comp_value_int').getValue(),10);
			var cmp2value = parseInt(Ext.getCmp('rmv_cmp2_comp_value_int').getValue(),10);
			var cmp3value = parseInt(Ext.getCmp('rmv_cmp3_comp_value_int').getValue(),10);
			//Comp Val.: <minus> Sum Of adjustments == Adj Value:

			//if (cmp1adj > 0 && cmp1value > 0) {
			comp1adjval = (cmp1value + cmp1adj);
			//}

			//if (cmp2adj > 0 && cmp2value > 0) {
			comp2adjval = (cmp2value + cmp2adj);
			//}

			//if (cmp3adj > 0 && cmp3value > 0) {
			comp3adjval = (cmp3value + cmp3adj);
			//}

			Ext.getCmp('rmv_cmp1_est_subject_value_int').setValue(comp1adjval);
			Ext.getCmp('rmv_cmp2_est_subject_value_int').setValue(comp2adjval);
			Ext.getCmp('rmv_cmp3_est_subject_value_int').setValue(comp3adjval);

			// Is cmp value and comp adjusted value different by 15% or more? If so
			// require a comment and show a comment text area
			// __MARKER__ textarea-cmp1-adj-comments

			// Defaults
			Ext.getCmp('rmv_cmp1_adj_notes_text').allowBlank = true;
			Ext.getCmp('rmv_cmp1_adj_notes_text').disable();
			Ext.getCmp('textarea-cmp1-adj-comments').hide();
			Ext.getCmp('rmv_cmp2_adj_notes_text').allowBlank = true;
			Ext.getCmp('rmv_cmp2_adj_notes_text').disable();
			Ext.getCmp('textarea-cmp2-adj-comments').hide();
			Ext.getCmp('rmv_cmp3_adj_notes_text').allowBlank = true;
			Ext.getCmp('rmv_cmp3_adj_notes_text').disable();
			Ext.getCmp('textarea-cmp3-adj-comments').hide();

			var cmp1AdjPercDiff = 0;
			if (cmp1value > 0 && comp1adjval > 0) {
				cmp1AdjPercDiff = Math.abs((cmp1value - comp1adjval) / cmp1value) * 100;
				//console.log('cmp1AdjPercDiff:[', cmp1AdjPercDiff, ']');
				if (cmp1AdjPercDiff >= 15) {
					Ext.getCmp('rmv_cmp1_adj_notes_text').allowBlank = false;
					Ext.getCmp('rmv_cmp1_adj_notes_text').markInvalid();
					Ext.getCmp('rmv_cmp1_adj_notes_text').enable();
					Ext.getCmp('textarea-cmp1-adj-comments').show();

					Ext.getCmp('textarea-cmp2-adj-comments').show();
					Ext.getCmp('textarea-cmp3-adj-comments').show();
				}
			}

			var cmp2AdjPercDiff = 0;
			if (cmp2value > 0 && comp2adjval > 0) {
				cmp2AdjPercDiff = Math.abs((cmp2value - comp2adjval) / cmp2value) * 100;
				if (cmp2AdjPercDiff >= 15) {
					Ext.getCmp('rmv_cmp2_adj_notes_text').allowBlank = false;
					Ext.getCmp('textarea-cmp2-adj-comments').show();
					Ext.getCmp('rmv_cmp2_adj_notes_text').markInvalid();
					Ext.getCmp('rmv_cmp2_adj_notes_text').enable();

					Ext.getCmp('textarea-cmp1-adj-comments').show();
					Ext.getCmp('textarea-cmp3-adj-comments').show();
				}
			}

			var cmp3AdjPercDiff = 0;
			if (cmp3value > 0 && comp3adjval > 0) {
				cmp3AdjPercDiff = Math.abs((cmp3value - comp3adjval) / cmp3value) * 100;
				if (cmp3AdjPercDiff >= 15) {
					Ext.getCmp('rmv_cmp3_adj_notes_text').allowBlank = false;
					Ext.getCmp('textarea-cmp3-adj-comments').show();
					Ext.getCmp('rmv_cmp3_adj_notes_text').markInvalid();
					Ext.getCmp('rmv_cmp3_adj_notes_text').enable();

					Ext.getCmp('textarea-cmp1-adj-comments').show();
					Ext.getCmp('textarea-cmp2-adj-comments').show();
				}
			}
		},

		updateRepairs: function(record) {
			// chkbx_structural_int, chkbx_roof_int, chkbx_rpr_other2value_int

			Ext.getCmp('chkbx_rpr_structural_int').setValue(false);
			Ext.getCmp('chkbx_rpr_roof_int').setValue(false);
			Ext.getCmp('chkbx_rpr_windr_int').setValue(false);
			Ext.getCmp('chkbx_rpr_painting_int').setValue(false);
			Ext.getCmp('chkbx_rpr_sidingtrim_int').setValue(false);
			Ext.getCmp('chkbx_rpr_landscape_int').setValue(false);
			Ext.getCmp('chkbx_rpr_garage_int').setValue(false);
			Ext.getCmp('chkbx_rpr_poolspa_int').setValue(false);
			Ext.getCmp('chkbx_rpr_outblds_int').setValue(false);
			Ext.getCmp('chkbx_rpr_trash_int').setValue(false);
			Ext.getCmp('chkbx_rpr_trmpstdmg_int').setValue(false);
			Ext.getCmp('chkbx_rpr_plmbfxt_int').setValue(false);
			Ext.getCmp('chkbx_rpr_flrcpt_int').setValue(false);
			Ext.getCmp('chkbx_rpr_wallsclg_int').setValue(false);
			Ext.getCmp('chkbx_rpr_util_int').setValue(false);
			Ext.getCmp('chkbx_rpr_appls_int').setValue(false);
			Ext.getCmp('chkbx_rpr_cabcarp_int').setValue(false);
			Ext.getCmp('chkbx_rpr_other1value_int').setValue(false);
			Ext.getCmp('chkbx_rpr_other2value_int').setValue(false);
			Ext.getCmp('chkbx_rpr_hvac_int').setValue(false);
			Ext.getCmp('chkbx_rpr_mold_int').setValue(false);
			Ext.getCmp('chkbx_rpr_intpnt_int').setValue(false);
			Ext.getCmp('chkbx_rpr_electrical_int').setValue(false);

			if (record.data.reconrpradd_structural_int > 0) {
				Ext.getCmp('chkbx_rpr_structural_int').setValue(true);
			}

			if (record.data.reconrpradd_roof_int > 0) {
				Ext.getCmp('chkbx_rpr_roof_int').setValue(true);
			}

			if (record.data.reconrpradd_windr_int > 0) {
				Ext.getCmp('chkbx_rpr_windr_int').setValue(true);
			}

			if (record.data.reconrpradd_painting_int > 0) {
				Ext.getCmp('chkbx_rpr_painting_int').setValue(true);
			}

			if (record.data.reconrpradd_sidingtrim_int > 0) {
				Ext.getCmp('chkbx_rpr_sidingtrim_int').setValue(true);
			}

			if (record.data.reconrpradd_landscape_int > 0) {
				Ext.getCmp('chkbx_rpr_landscape_int').setValue(true);
			}

			if (record.data.reconrpradd_garage_int > 0) {
				Ext.getCmp('chkbx_rpr_garage_int').setValue(true);
			}

			if (record.data.reconrpradd_poolspa_int > 0) {
				Ext.getCmp('chkbx_rpr_poolspa_int').setValue(true);
			}

			if (record.data.reconrpradd_outblds_int > 0) {
				Ext.getCmp('chkbx_rpr_outblds_int').setValue(true);
			}

			if (record.data.reconrpradd_trash_int > 0) {
				Ext.getCmp('chkbx_rpr_trash_int').setValue(true);
			}

			if (record.data.reconrpradd_trmpstdmg_int > 0) {
				Ext.getCmp('chkbx_rpr_trmpstdmg_int').setValue(true);
			}

			if (record.data.reconrpradd_plmbfxt_int > 0) {
				Ext.getCmp('chkbx_rpr_plmbfxt_int').setValue(true);
			}

			if (record.data.reconrpradd_flrcpt_int > 0) {
				Ext.getCmp('chkbx_rpr_flrcpt_int').setValue(true);
			}

			if (record.data.reconrpradd_wallsclg_int > 0) {
				Ext.getCmp('chkbx_rpr_wallsclg_int').setValue(true);
			}

			if (record.data.reconrpradd_util_int > 0) {
				Ext.getCmp('chkbx_rpr_util_int').setValue(true);
			}

			if (record.data.reconrpradd_appls_int > 0) {
				Ext.getCmp('chkbx_rpr_appls_int').setValue(true);
			}

			if (record.data.reconrpradd_cabcarp_int > 0) {
				Ext.getCmp('chkbx_rpr_cabcarp_int').setValue(true);
			}

			if (record.data.reconrpradd_other1value_int > 0) {
				Ext.getCmp('chkbx_rpr_other1value_int').setValue(true);
			}

			if (record.data.reconrpradd_other2value_int > 0) {
				Ext.getCmp('chkbx_rpr_other2value_int').setValue(true);
			}

			if (record.data.reconrpradd_intpnt_int > 0) {
				Ext.getCmp('chkbx_rpr_intpnt_int').setValue(true);
			}

			if (record.data.reconrpradd_electrical_int > 0) {
				Ext.getCmp('chkbx_rpr_electrical_int').setValue(true);
			}

			if (record.data.reconrpradd_hvac_int > 0) {
				Ext.getCmp('chkbx_rpr_hvac_int').setValue(true);
			}

			if (record.data.reconrpradd_mold_int > 0) {
				Ext.getCmp('chkbx_rpr_mold_int').setValue(true);
			}
		},

		requireAppraisalInfo: function() {
			var hasOA = Ext.getCmp('files_has_oa').getValue();
			var isFNC = Ext.getCmp('recon_FNC_Folder_Num_varchar').getValue();
			var shortForm = Ext.getCmp('rmv_short_form_enum').getValue();

			Ext.getCmp('rmv_orig_date').allowBlank = true;
			Ext.getCmp('rmv_orig_app_value_int').allowBlank = true;

			if (hasOA == 1 && isFNC.length > 0 && shortForm==='No') {
				Ext.getCmp('rmv_orig_date').allowBlank = false;
				Ext.getCmp('rmv_orig_app_value_int').allowBlank = false;
			}
		},

		uploadedFiles: [],
		updateRelatedFiles: function() {

			var releatedFiles = Ext.get('rmv-related-files');
			var shortform = Ext.getCmp('rmv_short_form_enum').getValue();
			var is_spo = Ext.getCmp('is_spo').getValue();

			if (this.dataRecord != null) {
				if (releatedFiles) {
					Ext.get('rmv-related-files').update('');
				}
				Ext.Ajax.request({
					url: '<?=$this->baseUrl?>/qa/rmvfiles',
					params: {
						esid: this.dataRecord.recon_ord_ID_int,
						orderid: this.dataRecord.recon_original_ord_ID_int,
						reconid: this.dataRecord.recon_ID_int,
						shortform: shortform,
						fncFolderNum: this.dataRecord.recon_FNC_Folder_Num_varchar,
						is_spo: is_spo
					},
					scope: this,
					success: function(response, opts) {
						var rs = Ext.decode(response.responseText);

						Ext.getCmp('form-rmv').uploadedFiles = rs.allRelatedFileTypes
						Ext.getCmp('files_has_research').setValue(0);
						Ext.getCmp('files_has_bporesearch').setValue(0);
						Ext.getCmp('files_has_miscresearch').setValue(0);
						Ext.getCmp('files_has_oaresearch').setValue(0);
						Ext.getCmp('files_has_hpro').setValue(0);

						Ext.getCmp('rmv_prior_change_notes_text').allowBlank = true;
						Ext.getCmp('rmv_priormkt_prepared_date').allowBlank = true;
						Ext.getCmp('rmv_priormkt_preparedby_char').allowBlank = true;
						Ext.getCmp('rmv_priormkt_preparedasis_char').allowBlank = true;
						Ext.getCmp('rmv_priormkt_preparedrepaired_char').allowBlank = true;
						Ext.getCmp('rmv_priormkt_preparedrepaircosts_char').allowBlank = true;

						var showReconReviewExplanation = false;
						Ext.getCmp('rmv_bpo_review_comment_char').allowBlank = true;
						Ext.getCmp('rmv_bpo_review_comment_char').hide();
						Ext.getCmp('container_priorbpo_explanation').hide();
						Ext.getCmp('rmv_bpo_review_comment_char').disable();

						Ext.getCmp('reconpriorbpo2').hide();
						Ext.getCmp('reconpriorbpo3').hide();
						Ext.getCmp('reconpriorbpo4').hide();
						Ext.getCmp('reconpriorbpo2_flag').setValue(0);
						Ext.getCmp('reconpriorbpo3_flag').setValue(0);
						Ext.getCmp('reconpriorbpo4_flag').setValue(0);

						var allowBlankBPO2 = true;
						var allowBlankBPO3 = true;
						var allowBlankBPO4 = true;

						var numPriorBPOs = (rs.nPriorBPOs + rs.nPriorAppraisals);

						for (var priorBpoNum = 1; priorBpoNum <= numPriorBPOs; priorBpoNum++) {
							if (priorBpoNum==2) {
								Ext.getCmp('reconpriorbpo2').show();
								Ext.getCmp('reconpriorbpo2_flag').setValue(1);
								allowBlankBPO2 = false;
								showReconReviewExplanation = true;
							}
							if (priorBpoNum==3) {
								Ext.getCmp('reconpriorbpo3').show();
								Ext.getCmp('reconpriorbpo3_flag').setValue(1);
								allowBlankBPO3 = false;
								showReconReviewExplanation = true;
							}
							if (priorBpoNum==4) {
								Ext.getCmp('reconpriorbpo4').show();
								Ext.getCmp('reconpriorbpo4_flag').setValue(1);
								allowBlankBPO4 = false;
								showReconReviewExplanation = true;
							}
						}

						if (true===showReconReviewExplanation) {
							Ext.getCmp('rmv_bpo_review_comment_char').allowBlank = false;
							Ext.getCmp('rmv_bpo_review_comment_char').show();
							Ext.getCmp('container_priorbpo_explanation').show();
							Ext.getCmp('rmv_bpo_review_comment_char').enable();
						}

						Ext.getCmp('reconpriorbpo2_review_date').allowBlank = allowBlankBPO2;
						Ext.getCmp('reconpriorbpo2_review_vendor_char').allowBlank = allowBlankBPO2;
						Ext.getCmp('reconpriorbpo2_review_access_enum').allowBlank = allowBlankBPO2;
						Ext.getCmp('reconpriorbpo2_review_90_as_is_int').allowBlank = allowBlankBPO2;
						Ext.getCmp('reconpriorbpo2_review_90_as_rep_int').allowBlank = allowBlankBPO2;
						Ext.getCmp('reconpriorbpo2_review_notes').allowBlank = allowBlankBPO2;
						//Ext.getCmp('reconpriorbpo2_review_comment').allowBlank = allowBlankBPO2;

						Ext.getCmp('reconpriorbpo3_review_date').allowBlank = allowBlankBPO3;
						Ext.getCmp('reconpriorbpo3_review_vendor_char').allowBlank = allowBlankBPO3;
						Ext.getCmp('reconpriorbpo3_review_access_enum').allowBlank = allowBlankBPO3;
						Ext.getCmp('reconpriorbpo3_review_90_as_is_int').allowBlank = allowBlankBPO3;
						Ext.getCmp('reconpriorbpo3_review_90_as_rep_int').allowBlank = allowBlankBPO3;
						Ext.getCmp('reconpriorbpo3_review_notes').allowBlank = allowBlankBPO3;
						//Ext.getCmp('reconpriorbpo3_review_comment').allowBlank = allowBlankBPO3;

						Ext.getCmp('reconpriorbpo4_review_date').allowBlank = allowBlankBPO4;
						Ext.getCmp('reconpriorbpo4_review_vendor_char').allowBlank = allowBlankBPO4;
						Ext.getCmp('reconpriorbpo4_review_access_enum').allowBlank = allowBlankBPO4;
						Ext.getCmp('reconpriorbpo4_review_90_as_is_int').allowBlank = allowBlankBPO4;
						Ext.getCmp('reconpriorbpo4_review_90_as_rep_int').allowBlank = allowBlankBPO4;
						Ext.getCmp('reconpriorbpo4_review_notes').allowBlank = allowBlankBPO4;
						//Ext.getCmp('reconpriorbpo4_review_comment').allowBlank = allowBlankBPO4;

						Ext.getCmp('origination_comments_section').show();
						Ext.getCmp('rmv_orig_amount_int').allowBlank = true;
						Ext.getCmp('rmv_orig_app_value_int').allowBlank = true;

						// Has OA file?
						if (true === rs.hasOA) {
							Ext.getCmp('files_has_oa').setValue(1);

							// Require OA comments, amount and value if short form
							if (shortform == 'Yes') {
								Ext.getCmp('rmv_orig_app_value_int').allowBlank = false;
							}
						}
						else {
							Ext.getCmp('files_has_oa').setValue(0);

							// Hide origination comments if no OA and is Short form
							if (shortform == 'Yes') {
								Ext.getCmp('origination_comments_section').hide();
							}
						}

						if (true === rs.hasReasearchFile) {
							Ext.getCmp('files_has_research').setValue(1);
							Ext.getCmp('rmv_prior_change_notes_text').allowBlank = false;
						}

						if (true === rs.hasBPOReasearchFile) {
							Ext.getCmp('files_has_bporesearch').setValue(1);
						}

						if (true === rs.hasMiscReasearchFile) {
							Ext.getCmp('files_has_miscresearch').setValue(1);
						}

						if (true === rs.hasOAReasearchFile) {
							Ext.getCmp('files_has_oaresearch').setValue(1);
						}

						if (true === rs.hasHistoryPro) {
							Ext.getCmp('files_has_hpro').setValue(1);
						}

						Ext.getCmp('files_has_realquest').setValue(0);
						if (true === rs.hasRealQuestFile) {
							Ext.getCmp('files_has_realquest').setValue(1);
						}
						
						Ext.getCmp('realquest_current_count').setValue(0);
						if (rs.realQuestCurrentCount > 0) {
							Ext.getCmp('realquest_current_count').setValue(rs.realQuestCurrentCount);
						}

						Ext.getCmp('files_has_realquest_current').setValue(0);
						if (true === rs.hasRealQuestCurrent) {
							Ext.getCmp('files_has_realquest_current').setValue(1);
						}

						Ext.getCmp('files_has_subject_mls').setValue(0);
						if (true === rs.hasSubjectMLS) {
							Ext.getCmp('files_has_subject_mls').setValue(1);
						}

						var hasPriorMktData = false;

						if (Ext.getCmp('rmv_priormkt_preparedasis_char')) {
							var pmktasis = Ext.getCmp('rmv_priormkt_preparedasis_char').getValue();
							if (!Ext.isEmpty(pmktasis)) {
								hasPriorMktData = true;
							}
						}

						var showPriorMkt = false;
						if (true === rs.hasPriorRMVFile || hasPriorMktData===true) {
							showPriorMkt = true;
							Ext.getCmp('rmv_priormkt_prepared_date').allowBlank = false;
							Ext.getCmp('rmv_priormkt_preparedby_char').allowBlank = false;
							Ext.getCmp('rmv_priormkt_preparedasis_char').allowBlank = false;
							Ext.getCmp('rmv_priormkt_preparedrepaired_char').allowBlank = false;
							Ext.getCmp('rmv_priormkt_preparedrepaircosts_char').allowBlank = false;
						}
						Ext.getCmp('fs-prior-recon-mktval').setVisible(showPriorMkt);

						Ext.getCmp('rmv_bpo_review_apprwrpr_text').allowBlank = true;
						Ext.getCmp('rmv_bpo_review_apprwrpr_text').hide();
						Ext.getCmp('rmv_bpo_review_apprwrpr_text').disable();
						Ext.getCmp('container_priorbpo_apprwrpr').hide();
						Ext.getCmp('files_has_appraisal_wrapper').setValue(0);

						if (rs.hasAppraisalWrapper === true) {
							Ext.getCmp('rmv_bpo_review_apprwrpr_text').allowBlank = false;
							Ext.getCmp('rmv_bpo_review_apprwrpr_text').show();
							Ext.getCmp('rmv_bpo_review_apprwrpr_text').enable();
							Ext.getCmp('container_priorbpo_apprwrpr').show();
							Ext.getCmp('files_has_appraisal_wrapper').setValue(1);
						}

						if (releatedFiles) {
							//Ext.get('rmv-related-files').insertHtml('afterBegin', rs.listrecon);
							Ext.get('rmv-related-files').insertHtml('afterBegin', rs.tblFiles);
						}

						this.requireAppraisalInfo();
					}
				});
			}
		},

		updateStatusPanel: function(data) {
			// RMV Status Panel
			Ext.getCmp('recon_status_age').hide();
			Ext.getCmp('recon_Status_char').hide();
			Ext.getCmp('recon_AssignedTo_char').hide();
			Ext.getCmp('recon_status_assigned').hide();
			Ext.getCmp('recon_ReconciledBy_char').hide();
			Ext.getCmp('recon_status_reconciled').hide();
			Ext.getCmp('recon_ReviewUser_char').hide();
			Ext.getCmp('recon_status_reviewed').hide();
			Ext.getCmp('reconvalarcexc_ReviewComments_char').hide();
			Ext.getCmp('reconvalarcexc_InitialComments_char').hide();
			Ext.getCmp('recon_exceptions_reasons').hide();
			Ext.getCmp('reconnt_rejected_by').hide();
			Ext.getCmp('reconnt_inserted_datetime').hide();
			Ext.getCmp('reconnt_note_text').hide();

			if (Ext.getCmp('recon_status_age').getValue().length > 0) {
				Ext.getCmp('recon_status_age').show();
			}
			if (Ext.getCmp('recon_Status_char').getValue().length > 0) {
				Ext.getCmp('recon_Status_char').show();
			}
			if (Ext.getCmp('recon_AssignedTo_char').getValue().length > 0) {
				Ext.getCmp('recon_AssignedTo_char').show();
			}
			if (Ext.getCmp('recon_status_assigned').getValue().length > 0) {
				Ext.getCmp('recon_status_assigned').show();
			}
			if (Ext.getCmp('recon_ReconciledBy_char').getValue().length > 0) {
				Ext.getCmp('recon_ReconciledBy_char').show();
			}
			if (Ext.getCmp('recon_status_reconciled').getValue().length > 0) {
				Ext.getCmp('recon_status_reconciled').show();
			}
			if (Ext.getCmp('recon_ReviewUser_char').getValue().length > 0) {
				Ext.getCmp('recon_ReviewUser_char').show();
			}
			if (Ext.getCmp('recon_status_reviewed').getValue().length > 0) {
				Ext.getCmp('recon_status_reviewed').show();
			}
			if (Ext.getCmp('reconvalarcexc_ReviewComments_char').getValue().length > 0) {
				Ext.getCmp('reconvalarcexc_ReviewComments_char').show();
			}
			if (Ext.getCmp('reconvalarcexc_InitialComments_char').getValue().length > 0) {
				Ext.getCmp('reconvalarcexc_InitialComments_char').show();
			}
			if (Ext.getCmp('recon_exceptions_reasons').getValue().length > 0) {
				Ext.getCmp('recon_exceptions_reasons').show();
			}


			if (data.autoQaResult) {
				Ext.getCmp('autoQaResult').show();
				Ext.getCmp('autoQaResult').setValue('&bull; ' + data.autoQaResult.replace("\n", '<br>&bull; '));
			}
			else {
				Ext.getCmp('autoQaResult').hide();
			}

			// update action notes
			if (data.recon_Status_char==='RMV Rejected' || data.recon_Status_char==='Draft Saved' || data.recon_Status_char==='Reconciled') {
				Ext.Ajax.request({
					url: '<?=$this->baseUrl?>/recon/lastnote',
					params: {
						id: data.recon_ID_int
					},
					scope: this,
					success: function(response, opts) {
						var rs = Ext.decode(response.responseText);
						if (rs.note!==false) {

							var stsDisplay = data.recon_Status_char;
							if (rs.note.reconnt_classification_varchar !== null) {
								stsDisplay += ' ' + rs.note.reconnt_classification_varchar
							}
							Ext.getCmp('recon_Status_char').setValue(stsDisplay);

							if (rs.note.reconusr_Login_char.length > 0) {
								Ext.getCmp('reconnt_rejected_by').show();
								Ext.getCmp('reconnt_rejected_by').setValue(rs.note.reconusr_Login_char);
							}
							if (rs.note.reconnt_inserted_datetime.length > 0) {
								Ext.getCmp('reconnt_inserted_datetime').show();
								Ext.getCmp('reconnt_inserted_datetime').setValue(rs.note.reconnt_inserted_datetime);
							}
							if (rs.note.reconnt_note_text.length > 0) {
								Ext.getCmp('reconnt_note_text').show();
								Ext.getCmp('reconnt_note_text').setValue(rs.note.reconnt_note_text);
							}
						}

					}
				});
			}

			var dt = new Date('Sep 20, 2012');
			var dtEnableFieldsOn = dt.format('Y-m-d');
			var dtNow = new Date();
			var dtToday = dtNow.format('Y-m-d');
			var isReview  = ('<?=$this->isReview?>'==1) ? true : false;
			var isPeerReview = ('<?=$this->isPeerReview?>'==1) ? true : false;

			if (isPeerReview) {
				Ext.getCmp('recon_AssignedTo_char').hide();
				Ext.getCmp('recon_status_assigned').hide();
				Ext.getCmp('recon_ReconciledBy_char').hide();
				Ext.getCmp('recon_status_reconciled').hide();
				Ext.getCmp('recon_ReviewUser_char').hide();
				Ext.getCmp('recon_status_reviewed').hide();
			} else if (isReview) {
				if (dtToday < dtEnableFieldsOn) {
					Ext.getCmp('recon_AssignedTo_char').hide();
					Ext.getCmp('recon_status_assigned').hide();
					Ext.getCmp('recon_ReconciledBy_char').hide();
					Ext.getCmp('recon_status_reconciled').hide();
				}

			} else {
				if (dtToday < dtEnableFieldsOn) {
					Ext.getCmp('recon_AssignedTo_char').hide();
					Ext.getCmp('recon_status_assigned').hide();
					Ext.getCmp('recon_ReconciledBy_char').hide();
					Ext.getCmp('recon_status_reconciled').hide();
					Ext.getCmp('recon_ReviewUser_char').hide();
				}
			}


		},

		syncReadOnlySubjectData: function() {
			var syncFields = [
				["rmv_bpo_review_90_as_is_int", "_sbj_comp_value_int"],
				["rmv_cust_addr_st_char",       "_sbj_address1_char"],
				["rmv_cust_addr_city_char",     "_sbj_city_char"],
				["rmv_cust_addr_state_char",    "_sbj_state_char"],
				["rmv_cust_addr_zip_char",      "_sbj_zip_char"],
				["rmv_prop_days_on_market_enum","_sbj_dom_int"],
				["rmv_prop_lot_size_float",     "_subject_lotsize_char"],
				["rmv_prop_sq_feet_float",      "_subject_gla_char"],
				["rmv_prop_condition_enum",     "_subject_condition_char"],
				["rmv_prop_num_rooms_int",      "_subject_rooms_int"],
				["rmv_prop_num_bedrooms_int",   "_subject_beds_int"],
				["rmv_prop_num_baths_decimal",  "_subject_baths_int"]
			];

			var fields,cmpMaster,cmpCopy;
			for (var i=0; i<syncFields.length; i++) {
				fields = syncFields[i];
				if (Ext.getCmp(fields[0]) && Ext.getCmp(fields[1])) {
					cmpMaster = Ext.getCmp(fields[0]);
					cmpCopy   = Ext.getCmp(fields[1]);

					cmpCopy.setValue(cmpMaster.getValue());
				}
			}

		},

		clearComp: function(compNumber) {
			var prefix = 'rmv_cmp' + compNumber + '_';
			var cmpPrefix = 'cmp' + compNumber + '_';

			Ext.Msg.show({
				title: 'Reset This Comp',
				msg: 'You will lose all data for this comp!  Are you sure you want to reset this comp?',
				buttons: Ext.Msg.YESNOCANCEL,
				icon: Ext.MessageBox.WARNING,
				fn: function(answer, text, cfg) {
					if (answer==='yes') {
						Ext.getCmp(prefix + 'source_enum').reset();
						Ext.getCmp(prefix + 'type_enum').reset();
						Ext.getCmp(prefix + 'recon_value_type_enum').reset();
						Ext.getCmp(prefix + 'comp_value_int').reset();
						Ext.getCmp(prefix + 'address1_char').reset();
						Ext.getCmp(prefix + 'city_char').reset();
						Ext.getCmp(prefix + 'state_char').reset();
						Ext.getCmp(prefix + 'zip_char').reset();
						Ext.getCmp(prefix + 'sbjdst_char').reset();
						Ext.getCmp(prefix + 'dom_int').reset();
						Ext.getCmp(prefix + 'sldlst_date').reset();
						Ext.getCmp(prefix + 'sldlst_adj_int').reset();
						Ext.getCmp(prefix + 'lotsize_char').reset();
						Ext.getCmp(prefix + 'lotsize_adj_int').reset();
						Ext.getCmp(prefix + 'gla_char').reset();
						Ext.getCmp(prefix + 'gla_adj_int').reset();
						Ext.getCmp(prefix + 'condition_char').reset();
						Ext.getCmp(prefix + 'condition_adj_int').reset();
						Ext.getCmp(prefix + 'rooms_int').reset();
						Ext.getCmp(prefix + 'rooms_adj_int').reset();
						Ext.getCmp(prefix + 'beds_int').reset();
						Ext.getCmp(prefix + 'beds_adj_int').reset();
						Ext.getCmp(prefix + 'baths_int').reset();
						Ext.getCmp(prefix + 'baths_adj_int').reset();
						Ext.getCmp(prefix + 'opt1_value_char').reset();
						Ext.getCmp(prefix + 'opt1_adj_int').reset();
						Ext.getCmp(prefix + 'opt2_value_char').reset();
						Ext.getCmp(prefix + 'opt2_adj_int').reset();
						Ext.getCmp(prefix + 'opt3_value_char').reset();
						Ext.getCmp(prefix + 'opt3_adj_int').reset();
						Ext.getCmp(prefix + 'opt4_value_char').reset();
						Ext.getCmp(prefix + 'opt4_adj_int').reset();
						Ext.getCmp(prefix + 'est_subject_value_int').reset();
						Ext.getCmp(cmpPrefix + 'adj_col2').reset();
						Ext.getCmp(prefix + 'notes_text').reset();
					}
				}
			});


		},
		// Count the number of prior BPOs uploaded
		getNumPriorBPOs: function(filesArray) {
			var numBPOs = 0;
			for (var i = 0; i < filesArray.length; i++) {
				switch (filesArray[i]['filetype']) {
					case 'BPO 1':
					case 'BPO 2':
					case 'BPO 3':
					case 'BPO 4':
					case 'BPO 5':
					case 'BPO Exterior':
					case 'BPO Interior':
						numBPOs++;
						break;
				}
			}
			return numBPOs;
		},
		/**
		 * Initialize UI
		 *
		 * This method is called by the work queue grid. If you need some code to fire as the form is loaded weave it in
		 * here.
		 */
		initUI: function () {
			this.generateOAComments();
			this.currentlyListed();
			this.ancillaryDataChange();
		},
		/**
		 * Generate OA Auto-Comments
		 */
		generateOAComments: function () {
			var oaProvided = Ext.getCmp('rmv_oa_provided_char').getValue();

			// Handle toggling
			if (oaProvided != 'Yes') {
				// OA Not Provided
				Ext.getCmp('generated-oa-comments').hide();
				Ext.getCmp('rmv_oa_stated_purpose_varchar').allowBlank = true; // Purpose and type not required
				Ext.getCmp('rmv_oa_type_of_appr_char').allowBlank = true;

				Ext.getCmp('rmv_oa_comment_varchar').setValue("");
				Ext.getCmp('rmv_oa_type_of_appr_char').setValue("");
				Ext.getCmp('rmv_oa_stated_purpose_varchar').setValue("");
				return;
			}
			else {
				// OA Provided
				Ext.getCmp('rmv_oa_stated_purpose_varchar').allowBlank = false; // Require purpose and type
				Ext.getCmp('rmv_oa_type_of_appr_char').allowBlank   = false;
				Ext.getCmp('generated-oa-comments').show();
			}

			var oaPurpose  = Ext.getCmp('rmv_oa_stated_purpose_varchar').getValue();
			var oaType     = Ext.getCmp('rmv_oa_type_of_appr_char').getValue();
			var oaDate     = Ext.getCmp('rmv_orig_date').getValue();
			var oaValue    = Ext.getCmp('rmv_orig_app_value_int').getValue();

			var oaDateFormatted = '[not set]';
			if (Ext.isDate(oaDate)) {
				oaDateFormatted = oaDate.format("m/d/Y");
			}

			var oaValueFormatted = '[not set]';
			if (Ext.isNumber(oaValue)) {
				oaValueFormatted = Ext.util.Format.number(oaValue, '0,000');
			}

			var comment =  String.format(
				"The {0} OA Valuation Report is dated {1} valuing the subject at ${2}. Reported purpose for the loan is {3} transaction.",
				oaType || '[?]',
				oaDateFormatted || '[?]',
				oaValueFormatted || '[?]',
				oaPurpose || '[?]'
			);

			Ext.getCmp('rmv_oa_comment_varchar').setValue(comment);
		},
		ancillaryDataChange: function() {
			var comments = Ext.getCmp('rmv_anc_bracketing_comment'),
				section  = Ext.getCmp('section_rmv_anc_bracketing_comment');


			if (this.isValueBracketedByAncillaryData()) {
				comments.allowBlank = true;
				comments.setValue("");
				section.hide();
			}
			else {
				comments.allowBlank = false;
				section.show();
			}
		},
		isValueBracketedByAncillaryData: function () {
			var rqHigh   = Ext.getCmp('rmv_anc_rq_saleprice_highest').getValue(),
				rqLow    = Ext.getCmp('rmv_anc_rq_saleprice_lowest').getValue(),
				rmvValue = parseInt(Ext.getCmp('comments_rmv_concl_as_is_int').getValue());
				
			if (!this.isAncillaryDataSet() || rmvValue > rqHigh || rmvValue < rqLow) {
				return false;
			}
			
			
			return true;
		},
		isAncillaryDataSet: function() {
			var rqHigh   = Ext.getCmp('rmv_anc_rq_saleprice_highest').getValue(),
				rqLow    = Ext.getCmp('rmv_anc_rq_saleprice_lowest').getValue(),
				rmvValue = Ext.getCmp('comments_rmv_concl_as_is_int').getValue();
				
			function isNumber (n) {
				return !isNaN(parseFloat(n)) && isFinite(n);
			}
			
			return (
				isNumber(rqHigh) &&
				isNumber(rqLow) &&
				isNumber(rmvValue)
			);
		},
		/**
		 * Current Listing UI Toggle
		 */
		currentlyListed: function () {
			var currentlyListed = (Ext.getCmp('rmv_currently_listed_char').getValue() == 'Yes');

			var colDatePrice        = Ext.getCmp('_col_current_list_date_and_price');
			var colReasonableSource = Ext.getCmp('_col_current_listing_reasonable_source');

			var elListDate          = Ext.getCmp('rmv_current_listing_date');
			var elListPrice         = Ext.getCmp('rmv_current_list_price_int');
			var elReasonable        = Ext.getCmp('combo_rmv_current_list_reasonableness_varchar');
			var elListSource        = Ext.getCmp('rmv_current_list_src_varchar');

			if (currentlyListed) {
				colDatePrice.show();
				colReasonableSource.show();
				elListDate.allowBlank   = false;
				elListPrice.allowBlank  = false;
				elReasonable.allowBlank = false;
				elListSource.allowBlank = false;
			}
			else {
				colDatePrice.hide();
				colReasonableSource.hide();
				elListDate.allowBlank   = true;
				elListPrice.allowBlank  = true;
				elReasonable.allowBlank = true;
				elListSource.allowBlank = true;
				elListDate.setValue("");
				elListPrice.setValue("");
				elReasonable.setValue("");
				elListSource.setValue("");
			}
		},
		/**
		 * Get Required Files
		 *
		 * Required files are return as an array of arrays. Since many requirements cover multiple file types, the inner
		 * array contains all the different acceptable file types that could be used to satisfy the requirement.
		 *
		 * @return array
		 */
		getRequiredFiles: function () {
			var availableTypes = {
				trulia:      ['Trulia.com Market Support'],
				requestCurr: ['RealQuest Current'],
				realtor:     ['Realtor.com Market Support'],
				google:      ['Google.com Market Support'],
				sitex:       ['Sitex Standard Research'],
				//historypro:  ['HistoryPro'],
				oa:          ['Origination Appraisal','1004','1004C','1025','1073','1075','2055','OA','Original Appraisal'],
				currentVal:  ['Current Valuation','Current Analysis','BPO','BPO Exterior','BPO Interior','Desktop Valuation']
			};
			var uniqueRequiredFiles = [],
				requiredFiles = [
				['RealQuest Current']
			];

			switch (Ext.getCmp('rmv_current_list_src_varchar').getValue()) {
				case 'Realtor.com':
					requiredFiles.push(['Current Listing - Realtor.com']);
					break;
				case 'Trulia.com':
					requiredFiles.push(['Current Listing - Trulia.com']);
					break;
				case 'Google.com':
					requiredFiles.push(['Current Listing - Google.com']);
					break;
			}

			switch (Ext.getCmp('combo_rmv_src_prop_attributes_varchar').getValue()) {
				case 'Google':
					requiredFiles.push(['Property Attributes - Google.com']);
					break;
				case 'Trulia':
					requiredFiles.push(['Property Attributes - Trulia.com']);
					break;
				case 'Realtor.com':
					requiredFiles.push(['Property Attributes - Realtor.com']);
					break;
			}

			switch (Ext.getCmp('combo_rmv_src_market_data_varchar').getValue()) {
				case 'Google.com':
					requiredFiles.push(['Market Data - Google.com']);
					break;
				case 'Trulia.com':
					requiredFiles.push(['Market Data - Trulia.com']);
					break;
				case 'Realtor.com':
					requiredFiles.push(['Market Data - Realtor.com']);
					break;
			}

			var match;
			for(var i=0; i<requiredFiles.length; i++) {
				match = false;
				for(var k=0; k<uniqueRequiredFiles.length; k++) {
					if (uniqueRequiredFiles[k] == requiredFiles[i]) {
						match = true;
						break;
					}
				}
				if (!match) {
					uniqueRequiredFiles.push(requiredFiles[i]);
				}
			}

			return uniqueRequiredFiles;
		},
		getMissingRequiredFiles: function () {
			var requiredFiles = this.getRequiredFiles(),
				uploadedFiles = this.uploadedFiles,
				missing       = [],
				file;


			function arrayContains (arr, item) {
				var contains = false;
				Ext.each(arr, function(el) {
					if (el == item) {
						contains = true;
					}
				});
				return contains;
			}


			while (requiredFiles.length > 0) {
				file = requiredFiles.pop();
				if (!arrayContains(uploadedFiles, file)) {
					missing.push(file);
				}
			}

			return missing;
		}
	});

	Combo_FormRMVCompSource = Ext.extend(Ext.form.ComboBox, {
		constructor: function(config) {
			Ext.apply(this, {
				store: new Ext.data.SimpleStore({
					fields: ['source'],
					data : [
						['BPO 1'],
						['BPO 2'],
						['BPO 3'],
						['BPO 4'],
						['BPO 5'],
						['Ancillary Data'],
						['Appraisal'],
						['ACRP']
					]
				}),
				displayField:'source',
				valueField:'source',
				forceSelection: true,
				editable:true,
				triggerAction: 'all',
				mode: 'local',
				selectOnFocus:true
			});

			Combo_FormRMVCompSource.superclass.constructor.apply(this, arguments);
		}
	});
	Ext.reg('combormvcmpsrc', Combo_FormRMVCompSource);

	Combo_FormRMVCompType = Ext.extend(Ext.form.ComboBox, {
		constructor: function(config) {
			Ext.apply(this, {
				store: new Ext.data.SimpleStore({
					fields: ['type'],
					data : [
						['Sale 1'],
						['Sale 2'],
						['Sale 3'],
						['Sale 4'],
						['Sale 5'],
						['Sale 6'],
						['Sale 7'],
						['Sale 8'],
						['Sale 9'],
						['List 1'],
						['List 2'],
						['List 3'],
						['List 4'],
						['Ancillary Sale'],
						['Ancillary List']
					]
				}),
				displayField:'type',
				valueField:'type',
				forceSelection: true,
				editable:true,
				triggerAction: 'all',
				mode: 'local',
				selectOnFocus:true
			});

			Combo_FormRMVCompType.superclass.constructor.apply(this, arguments);
		}
	});
	Ext.reg('combormvcmptyp', Combo_FormRMVCompType);

	Combo_FormRMVCompValType = Ext.extend(Ext.form.ComboBox, {
		constructor: function(config) {
			Ext.apply(this, {
				store: new Ext.data.SimpleStore({
					fields: ['valtype'],
					data : [
						['As Is'],
						['As Repaired']
					]
				}),
				displayField:'valtype',
				valueField:'valtype',
				forceSelection: true,
				editable:true,
				triggerAction: 'all',
				mode: 'local',
				selectOnFocus:true
			});

			Combo_FormRMVCompValType.superclass.constructor.apply(this, arguments);
		}
	});
	Ext.reg('combormvcmpvaltyp', Combo_FormRMVCompValType);

	Combo_FormRMVCompSaleType = Ext.extend(Ext.form.ComboBox, {
		constructor: function(config) {
			Ext.apply(this, {
				store: new Ext.data.SimpleStore({
					fields: ['saletype'],
					data : [
						['Standard'],
						['REO'],
						['Shortsale'],
						['Investor'],
						['Auction'],
						['Owner'],
						['Other']
					]
				}),
				displayField:'saletype',
				valueField:'saletype',
				forceSelection: true,
				editable:true,
				triggerAction: 'all',
				mode: 'local',
				selectOnFocus:true
			});

			Combo_FormRMVCompSaleType.superclass.constructor.apply(this, arguments);
		}
	});
	Ext.reg('combormvcmpsaletyp', Combo_FormRMVCompSaleType);

	Combo_FormRMVCompCond = Ext.extend(Ext.form.ComboBox, {
		constructor: function(config) {
			Ext.apply(this, {
				store: new Ext.data.SimpleStore({
					fields: ['condition'],
					data : [
						['Excellent'],
						['Good'],
						['Average'],
						['Fair'],
						['Poor']
					]
				}),
				displayField:'condition',
				valueField:'condition',
				forceSelection: true,
				editable:true,
				triggerAction: 'all',
				mode: 'local',
				selectOnFocus:true
			});

			Combo_FormRMVCompCond.superclass.constructor.apply(this, arguments);
		}
	});
	Ext.reg('combormvcmpcnd', Combo_FormRMVCompCond);

	Combo_RMVBaths = Ext.extend(Ext.form.ComboBox, {
		constructor: function(config) {
			Ext.apply(this, {
				store: new Ext.data.SimpleStore({
					fields: ['item'],
					data : [
						['0'],
						['1'],
						['1.5'],
						['2'],
						['2.5'],
						['3'],
						['3.5'],
						['4'],
						['4.5'],
						['5'],
						['5.5'],
						['6'],
						['6.5'],
						['7'],
						['7.5'],
						['8'],
						['8.5'],
						['9'],
						['9.5'],
						['10'],
						['10.5'],
						['11'],
						['11.5'],
						['12'],
						['12.5'],
						['13'],
						['13.5'],
						['14'],
						['14.5'],
						['15'],
						['15.5'],
						['16'],
						['16.5'],
						['17'],
						['17.5'],
						['18'],
						['18.5'],
						['19'],
						['19.5'],
						['20']
					]
				}),
				displayField:'item',
				valueField:'item',
				forceSelection: false,
				editable:true,
				triggerAction: 'all',
				mode: 'local',
				selectOnFocus:true
			});

			Combo_RMVBaths.superclass.constructor.apply(this, arguments);
		}
	});
	Ext.reg('combormvbaths', Combo_RMVBaths);

	Combo_RMVBeds = Ext.extend(Ext.form.ComboBox, {
		constructor: function(config) {
			Ext.apply(this, {
				store: new Ext.data.SimpleStore({
					fields: ['item'],
					data : [
						['0'],
						['1'],
						['2'],
						['3'],
						['4'],
						['5'],
						['6'],
						['7'],
						['8'],
						['9'],
						['10'],
						['11'],
						['12'],
						['13'],
						['14'],
						['15'],
						['16'],
						['17'],
						['18'],
						['19'],
						['20']
					]
				}),
				displayField:'item',
				valueField:'item',
				forceSelection: false,
				editable:true,
				triggerAction: 'all',
				mode: 'local',
				selectOnFocus:true
			});

			Combo_RMVBeds.superclass.constructor.apply(this, arguments);
		}
	});
	Ext.reg('combormvbeds', Combo_RMVBeds);

	TextField_Dollar = Ext.extend(Ext.form.NumberField, {
		constructor: function(config) {
			Ext.apply(this, {
				cls: 'textfield-dollar-bg',
				invalidClass: 'textfield-dollar-bg-invalid',
				decimalPrecision: 0
			});

			TextField_Dollar.superclass.constructor.apply(this, arguments);
		}
	});
	Ext.reg('dollarfield', TextField_Dollar);

	TextField_Percent = Ext.extend(Ext.form.NumberField, {
		constructor: function(config) {
			Ext.apply(this, {
				cls: 'textfield-percent-bg',
				invalidClass: 'textfield-percent-bg-invalid',
				decimalPrecision: 0
			});

			TextField_Percent.superclass.constructor.apply(this, arguments);
		}
	});
	Ext.reg('percentfield', TextField_Percent);

	DateField_RMV = Ext.extend(Ext.form.DateField, {
		constructor: function(config) {
			//var dt = new Date().add(Date.DAY, 1);
			Ext.apply(this, {
				minValue: '01/01/2000',
				maxValue: new Date().add(Date.DAY, 1)
			});

			DateField_RMV.superclass.constructor.apply(this, arguments);
		}
	});
	Ext.reg('datermv', DateField_RMV);

	Combo_States = Ext.extend(Ext.form.ComboBox, {
		constructor: function(config) {
			Ext.apply(this, {
				store: new Ext.data.SimpleStore({
					fields: ['abbr', 'state', 'nick'],
					data : [
						['AL', 'Alabama', 'The Heart of Dixie'],
						['AK', 'Alaska', 'The Land of the Midnight Sun'],
						['AZ', 'Arizona', 'The Grand Canyon State'],
						['AR', 'Arkansas', 'The Natural State'],
						['CA', 'California', 'The Golden State'],
						['CO', 'Colorado', 'The Mountain State'],
						['CT', 'Connecticut', 'The Constitution State'],
						['DE', 'Delaware', 'The First State'],
						['DC', 'District of Columbia', "The Nation's Capital"],
						['FL', 'Florida', 'The Sunshine State'],
						['GA', 'Georgia', 'The Peach State'],
						['HI', 'Hawaii', 'The Aloha State'],
						['ID', 'Idaho', 'Famous Potatoes'],
						['IL', 'Illinois', 'The Prairie State'],
						['IN', 'Indiana', 'The Hospitality State'],
						['IA', 'Iowa', 'The Corn State'],
						['KS', 'Kansas', 'The Sunflower State'],
						['KY', 'Kentucky', 'The Bluegrass State'],
						['LA', 'Louisiana', 'The Bayou State'],
						['ME', 'Maine', 'The Pine Tree State'],
						['MD', 'Maryland', 'Chesapeake State'],
						['MA', 'Massachusetts', 'The Spirit of America'],
						['MI', 'Michigan', 'Great Lakes State'],
						['MN', 'Minnesota', 'North Star State'],
						['MS', 'Mississippi', 'Magnolia State'],
						['MO', 'Missouri', 'Show Me State'],
						['MT', 'Montana', 'Big Sky Country'],
						['NE', 'Nebraska', 'Beef State'],
						['NV', 'Nevada', 'Silver State'],
						['NH', 'New Hampshire', 'Granite State'],
						['NJ', 'New Jersey', 'Garden State'],
						['NM', 'New Mexico', 'Land of Enchantment'],
						['NY', 'New York', 'Empire State'],
						['NC', 'North Carolina', 'First in Freedom'],
						['ND', 'North Dakota', 'Peace Garden State'],
						['OH', 'Ohio', 'The Heart of it All'],
						['OK', 'Oklahoma', 'Oklahoma is OK'],
						['OR', 'Oregon', 'Pacific Wonderland'],
						['PA', 'Pennsylvania', 'Keystone State'],
						['PR', 'Puerto Rico', 'John Is His Name'],
						['RI', 'Rhode Island', 'Ocean State'],
						['SC', 'South Carolina', 'Nothing Could be Finer'],
						['SD', 'South Dakota', 'Great Faces, Great Places'],
						['TN', 'Tennessee', 'Volunteer State'],
						['TX', 'Texas', 'Lone Star State'],
						['UT', 'Utah', 'Salt Lake State'],
						['VT', 'Vermont', 'Green Mountain State'],
						['VA', 'Virginia', 'Mother of States'],
						['WA', 'Washington', 'Green Tree State'],
						['WV', 'West Virginia', 'Mountain State'],
						['WI', 'Wisconsin', "America's Dairyland"],
						['WY', 'Wyoming', 'Like No Place on Earth']
					]
				}),
				displayField:'abbr',
				valueField:'abbr',
				forceSelection: true,
				editable:true,
				triggerAction: 'all',
				mode: 'local',
				selectOnFocus:true
			});

			Combo_States.superclass.constructor.apply(this, arguments);
		}
	});
	Ext.reg('combostates', Combo_States);

	Combo_FormRMVCompOpts = Ext.extend(Ext.form.ComboBox, {
		constructor: function(config) {
			Ext.apply(this, {
				store: new Ext.data.SimpleStore({
					fields: ['opts'],
					data : [
						['Age'],
						['Basement Finished'],
						['Basement Unfinished'],
						['Construction Quality'],
						['Design Appeal'],
						['Fireplace'],
						['Functional Utility'],
						['Garage / Bays'],
						['Heating / Cooling'],
						['Location'],
						//['Market Conditions'],
						//['Miscellaneous'],
						['Pool Type / Spa'],
						['Porch / Patio / Deck'],
						['Seller Concessions'],
						['View'],
						['Water Supply / Septic']
					]
				}),
				displayField:'opts',
				valueField:'opts',
				forceSelection: true,
				editable:true,
				triggerAction: 'all',
				mode: 'local',
				selectOnFocus:true
			});

			Combo_FormRMVCompOpts.superclass.constructor.apply(this, arguments);
		}
	});
	Ext.reg('combormvcmpopts', Combo_FormRMVCompOpts);

	Combo_FormRMVYesNo = Ext.extend(Ext.form.ComboBox, {
		constructor: function(config) {
			Ext.apply(this, {
				store: new Ext.data.SimpleStore({
					fields: ['answer'],
					data : [
						['Yes'],
						['No']
					]
				}),
				displayField:'answer',
				valueField:'answer',
				forceSelection: true,
				editable: false,
				triggerAction: 'all',
				mode: 'local',
				selectOnFocus:true
			});

			Combo_FormRMVYesNo.superclass.constructor.apply(this, arguments);
		}
	});
	Ext.reg('combormvyn', Combo_FormRMVYesNo);

});

Ext.onReady(function(){
	Ext.QuickTips.init();

    var companyInfo = (<?php echo $this->companyInfo; ?>) || {};

	Grid_ManageWorkqueue = function(config) {
		Ext.apply(this, config);

		this.selectedFileName = null;

		this.reader = new Ext.data.JsonReader({
			root: 'orders',
			totalProperty: 'count',
			id: 'recon_ID_int'
		}, [
			{name: 'recon_ID_int'},
			{name: 'recon_ord_ID_int'},
			{name: 'recon_original_ord_ID_int'},
			{name: 'recon_Priority_enum'},
			{name: 'recon_Status_char'},
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
			{name: 'reconvalarcexc_Status_enum'},
			{name: 'reconvalarcexc_ID_int'},
			{name: 'recon_FNC_Folder_Num_varchar'},
			{name: 'reconvalarc_DestVendor_char'},
			{name: 'Source'},
            {name: 'recon_Reconciled_datetime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
            {name: 'FormType'},
            {name: 'recon_PeerReviewAssignedTo_char'},
            {name: 'recon_PeerReviewAssignedTo_datetime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
            {name: 'SPO'}
		]);

		// store for drop down file select (comboFileName)
		this.dsUsers = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({
				url: '<?=$this->baseUrl?>/managequeues/users'
			}),
			reader:  new Ext.data.JsonReader({
						root: 'data',
						totalProperty: 'count',
						id: 'reconusr_ID_int'
						}, [
							{name: 'reconusr_ID_int'},
							{name: 'reconusr_Login_char'}
						]
					),
			remoteSort: false,
			autoLoad: false
		});

		this.ds = new Ext.data.Store({
			url: '<?=$this->baseUrl?>/managequeues/ordergrid',
			reader: this.reader,
			remoteSort: true,
			listeners: {
				scope: this,
				loadexception: function() {
					Ext.Msg.alert('Database Error', 'Orders could not be loaded due to database error.');
				}
			},
			autoLoad: {
				params: {
					start: 0,
					limit: 25
				}
			}
		});

		this.sm = new Ext.grid.CheckboxSelectionModel({
		});

		this.filters = new Ext.ux.grid.GridFilters({
	   filters:[
			{type: 'list', dataIndex: 'recon_Priority_enum', options: ['high','normal','low'], phpMode: true},
			{type: 'string',  dataIndex: 'recon_ord_ID_int'},
			{type: 'string',  dataIndex: 'recon_Address_Street_char'},
			{type: 'string',  dataIndex: 'recon_Address_City_char'},
			{type: 'string',  dataIndex: 'recon_Address_State_char'},
			{type: 'string',  dataIndex: 'recon_Address_Zip_char'},
			{type: 'string',  dataIndex: 'recon_Status_char'},
	    	{type: 'string',  dataIndex: 'recon_AssignedTo_char'},
			{type: 'string',  dataIndex: 'recon_LoanNumber_char'},
			{type: 'date',  dataIndex: 'recon_Loaded_datetime'}
			/*,
			{type: 'list', dataIndex: 'FormType', options: ['Short','Long'], phpMode: true}*/
			
	  ]
	});

		this.cm = new Ext.grid.ColumnModel([
			this.sm,
			{header: 'Priority', dataIndex: 'recon_Priority_enum', sortable: true, width:45,
				editor: new Ext.form.ComboBox({
					id: 'fm_priority',
					typeAhead: true,
					triggerAction: 'all',
					store: ['high','normal','low']
				}) },

		    {header: "Order ID", width: 85, sortable: true, dataIndex: 'recon_ord_ID_int', renderer: this.renderExceptionFlag},
			<? // Only ES and Company Zero should see the source column
			   if ($this->companyAbbr == 'ES' || $this->companyId == 0) {
			?>
		    {header: "Source", width: 50, sortable: true, dataIndex: 'Source'},
			<? } ?>
		    {header: "Vendor", sortable: true, dataIndex: 'reconvalarc_DestVendor_char', hidden: true},
			{header: "Link", width: 60, dataIndex: '', renderer: this.renderLink, hidden: false},
			{header: "Address", width: 160, sortable: true, dataIndex: 'recon_Address_Street_char', renderer: this.renderAddress},
			{header: "City", sortable: true, dataIndex: 'recon_Address_City_char'},
			{header: "State", sortable: true, dataIndex: 'recon_Address_State_char', width:35},
			{header: "Zip", sortable: true, dataIndex: 'recon_Address_Zip_char', width:50},
			{header: "Status", width: 75, sortable: true, dataIndex: 'recon_Status_char'/*, renderer: this.renderStatus*/},
			{header: "Assigned To", width: 110, sortable: true, dataIndex: 'recon_AssignedTo_char', hidden: false,
				editor: new Ext.form.ComboBox({
					id: 'fm_assignedto',
					typeAhead: true,
					triggerAction: 'all',
					displayField: 'reconusr_Login_char',
					valueField: 'reconusr_Login_char',
					store: this.dsUsers
				}) },
			{header: 'Reviewer', width: 110, sortable: true, dataIndex: 'recon_PeerReviewAssignedTo_char', hidden: false},
			/*{header: 'RA Name', width: 110, sortable: true, dataIndex: 'recon_Status_char', hidden: false, renderer: this.renderRAName},*/
			{header: "Loan #", width: 90, sortable: true, dataIndex: 'recon_LoanNumber_char'},
			{header: "Loaded On", width: 105, sortable: true, dataIndex: 'recon_Loaded_datetime', renderer: this.renderDate},
            {header: "Recon./Saved On", width: 105, sortable: true, dataIndex: 'recon_Reconciled_datetime', renderer: this.renderDate},
            {header: "Form", width: 80, sortable: true, dataIndex: 'FormType'},
            {header: "SPO", width: 60, sortable: false, dataIndex: 'SPO' }
		]);

		this.tb = new Ext.Toolbar();
		this.tb.add({
			text: 'Change Priority',
			scope: this,
			handler: this.priorityHandler
		},'-',{
			text: 'Change Status',
			scope: this,
			handler: this.statusHandler
		},'-',{
			text: 'Assign Orders',
			scope: this,
			handler: this.assignHandler
		},'-',{
			text: 'Clear Filters',
			scope: this,
			handler: function() {
				this.filters.clearFilters();
			}
		},'-',{
			text: 'Export',
			scope: this,
			handler: this.exportHandler
		},'-',{
			text: '<?=$this->queueButtonText?>',
			scope: this,
			handler: this.toggleQueuesSetting
		},"->",{
			text: 'Unassign Peer Reviewer',
			scope: this,
			handler: this.unassignPeerReviewer
		},"->",{
			text: 'Unassign Orders',
			scope: this,
			handler: this.unassignHandler
		});

		Grid_ManageWorkqueue.superclass.constructor.call(this, {
			id: 'editor-grid',
			title: 'Manage Reconciliation Queue',
			region: 'center',
			border: false,
			loadMask: {msg: 'Loading...', store: this.ds},
			frame: true,
			store: this.ds,
			cm: this.cm,
			sm: this.sm,
			clicksToEdit: 1,
			plugins: this.filters,
			tbar: this.tb/*,
			bbar: new Ext.PagingToolbar({
				pageSize: 25,
				store: this.ds,
				displayInfo: true,
				width: 320,
				plugins: this.filters,
				emptyMsg: "No results to display"
			})*/
		});

		this.on('afteredit', this.onAfterEdit, this);
	};


	Ext.extend(Grid_ManageWorkqueue, Ext.grid.EditorGridPanel, {
		renderRAName: function(status, p, record) {
			if (status=='Assigned') {
				return '';
			}
			
			if (status=='Pending Peer Review') {
				return '';
			}
			
			if (status=='Draft Saved') {
				return '';
			}
			
			if (Ext.isString(record.data.recon_PeerReviewAssignedTo_char)) {
				if (record.data.recon_PeerReviewAssignedTo_char.length > 0) {
					return record.data.recon_PeerReviewAssignedTo_char;
				}
			}
			
			return record.data.recon_ReconciledBy_char;
		},
		renderStatus: function(status, p, record) {
			switch (status) {
				case 'Assigned':
				case 'Pending Peer Review':
				case 'Draft Saved':
					return 'Loaded';
					break;
					
				case 'Peer Review In Progress':
					return 'In Progress';
					break;
					
				case 'Peer Review Failed':
					return 'Failed';
					break;
					
				default:
					return status;
					break;
			}
		},
		renderSource: function(v, p, record) {
			return (record.data.recon_FNC_Folder_Num_varchar != null) ? 'CMS':'RMV';
		},
		renderLink: function(v, p, record) {
		    switch (record.data.recon_Status_char) {
		    	case 'Peer Review In Progress':
		    		return '<a href="<?= $this->baseUrl ?>/queues/index/mode/peerreview/ordid/'+record.data.recon_ord_ID_int+'">Peer Review</a>';
		    		break;
		        case 'Reconciled':
		        case 'Failed':
                    if (companyInfo.abbreviation == 'IVG') {
                        return '<a href="<?= $this->baseUrl ?>/queues/index/ordid/'+record.data.recon_ord_ID_int+'">RMV</a>';
                    }
                    else {
                        return '<a href="<?= $this->baseUrl ?>/queues/index/mode/review/ordid/'+record.data.recon_ord_ID_int+'">Review</a>';
                    }
                    break;

                case 'Assigned':
                case 'Draft Saved':
                    return '<a href="<?= $this->baseUrl ?>/queues/index/ordid/'+record.data.recon_ord_ID_int+'">RMV</a>';
                    break;

                default:
                    return '';
		    }
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


						case 'Resolved':
						case 'Cancelled':
							return '<span class="tdbg-flag-green">' + v + '</span>';

					}
				}
			}

			return '<span class="tdbg-flag-none">' + v + '</span>';
		},

		exportHandler: function(btn) {
			Eval.grid.exportAsXLS(Ext.getCmp('editor-grid'), "ManageReconQueue.xls");
		},
		priorityHandler: function(btn) {
			var s = Ext.getCmp('editor-grid').getSelectionModel();
			if (s.getCount() > 0){
				var win = new Ext.Window({
					id: 'win-priority',
					title: 'Order Priority',
					width: 400,
					height: 300
				});
				var arr = s.getSelections();
				var rec = [];
				for (i = 0; i < arr.length; i++) {
					rec[i] = arr[i].data.recon_ID_int;
				}
				var fm = new FormMQPriority({
					data: rec
				});
				win.add(fm);
				win.show();
			}
		},
		statusHandler: function(btn) {
			var s = Ext.getCmp('editor-grid').getSelectionModel();
			if (s.getCount() > 0){
				var win = new Ext.Window({
					id: 'win-status',
					title: 'Order Status',
					width: 400,
					height: 300
				});
				var arr = s.getSelections();
				var rec = [];
				for (i = 0; i < arr.length; i++) {
					rec[i] = arr[i].data.recon_ID_int;
				}
				var fm = new FormMQStatus({
					data: rec
				});
				win.add(fm);
				win.show();
			}
		},

		unassignPeerReviewer: function(btn) {
			var s = Ext.getCmp('editor-grid').getSelectionModel();
			if (s.getCount() > 0){

				var arr = s.getSelections();
				var rec = [];
				for (i = 0; i < arr.length; i++) {
					if (arr[i].data.recon_PeerReviewAssignedTo_char) {
						rec[i] = {
							id: arr[i].data.recon_ID_int,
							user: arr[i].data.recon_PeerReviewAssignedTo_char
						};
					}
				}

				//console.log(rec);

				
				if (rec.length > 0) {
					Ext.Ajax.request({
						url: '<?=$this->baseUrl?>/managequeues/unassignpeerreviewer',
						method: 'POST',
						params: {
							ids: Ext.encode(rec)
						},
						success: function() {
							Ext.getCmp('editor-grid').getStore().reload();
							Ext.Msg.alert('Status', 'Peer Review Unassignment Performed Successfully.');
						},
						scope: this
					});
				} else {
					alert('Nothing to unassign');
				}
			} else {
				alert('No items selected');
			}
		},

		unassignHandler: function(btn) {
			var s = Ext.getCmp('editor-grid').getSelectionModel();
			if (s.getCount() > 0){

				var arr = s.getSelections();
				var rec = [];
				for (i = 0; i < arr.length; i++) {
					if (arr[i].data.recon_AssignedTo_char) {
						rec[i] = {
							id: arr[i].data.recon_ID_int,
							user: arr[i].data.recon_AssignedTo_char
						};
					}
				}
				if (rec.length > 0) {
					Ext.Ajax.request({
						url: '<?=$this->baseUrl?>/managequeues/unassign',
						method: 'POST',
						params: {
							ids: Ext.encode(rec)
						},
						success: function() {
							Ext.getCmp('editor-grid').getStore().reload();
							
						},
						scope: this
					});
				} else {
					alert('Nothing to unassign');
				}
			} else {
				alert('No items selected');
			}
		},
		assignHandler: function(btn) {
			var s = Ext.getCmp('editor-grid').getSelectionModel();
			if (s.getCount() > 0){
				var win = new Ext.Window({
					id: 'win-assign',
					title: 'Order Assignment',
					width: 400,
					height: 300
				});
				var arr = s.getSelections();
				var rec = [];
				for (i = 0; i < arr.length; i++) {
					rec[i] = arr[i].data.recon_ID_int;
				}
				var fm = new FormMQAssignment({
					data: rec
				});
				win.add(fm);
				win.show();
			}
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
			return addr;
		},
		onAfterEdit: function(e) {
			var auditId = e.record.get('recon_ID_int');
			var priority = e.record.get('recon_Priority_enum');
			var login = e.record.get('recon_AssignedTo_char');

			Ext.Ajax.request({
				url: '<?=$this->baseUrl?>/managequeues/editrow',
				method: 'POST',
				params: {
					auditId: auditId,
					priority: priority,
					login: login
				},
				success: this.responseAfterEdit,
				scope: this
			});
		},
		responseAfterEdit: function(result,options) {
			var Response = Ext.util.JSON.decode(result.responseText);
			if (Response.success==1) {
				//oGrid_Event.record.set('newRecord','no');
				this.getStore().commitChanges();
			} else {
				Ext.Msg.alert('Error', 'Error updating field');
			}
		},
		toggleQueuesSetting: function(btn) {
			var btnText = btn.getText();
			var settingValue = 1;
			var msgConfirm = 'Get Order on the queues has been disabled.';
			
			if (btnText==='Enable Queues') {
				btn.setText('Disable Queues');
				msgConfirm = 'Get Order on the queues has been enabled.';
				settingValue = 0;
			} else {
				btn.setText('Enable Queues');
			}
			
			Ext.Ajax.request({
				url: '<?=$this->baseUrl?>/managequeues/togglequeuesetting',
				method: 'POST',
				params: {
					settingValue: settingValue
				},
				success: function(result, opts) {
					Ext.Msg.alert('Server Response', msgConfirm);
				},
				failure: function() {
					Ext.Msg.alert('System Error', 'There was a server error. Please contact IT.');
				},
				scope: this
			});
		}
	});
});

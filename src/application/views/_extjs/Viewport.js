Ext.onReady(function(){
	Ext.QuickTips.init();
	var commentsPanel = new Panel_ReconComments();

	// Remote access sessions will see a different UI
    var isRemoteAccessSession = <?= $this->remoteSession; ?>;

	var viewPortConfig = {
		id: 'vp-recon',
		layout: 'border',
		items: [{
			region: 'north',
			layout: 'column',
			height: 60,
			border: false,
			frame: false,
			margins: '0 0 5 0',
			items: [{
				border: false,
				frame: false,
				columnWidth: 0.25,
				html: '<img src="<?=$this->baseUrl?>/images/eval_logo_small.jpg" border="0" style="padding:5px;"/>'
			},{
				id: 'qa-panel-userwelcome',
				border: false,
				frame: false,
				columnWidth: 0.75,
				cls: 'ux-north-right-panel',
<?php
    if ($_SESSION['LPS_DISABLE_NAV'] === true) {
?>
				html: '<a href="<?=$this->baseUrl?>/auth/logout">Logout</a>'
<?php
    }
    else {
?>
				html: '<a href="<?=$this->baseUrl?>/auth/logout">Logout</a>&nbsp;|&nbsp;<a href="#" onClick="var win = new Window_ButtonMenu({	closable: true }); win.show(); return false;">Main Menu</a>'
<?php
    }
?>
			}],
			listeners: {
				render: function() {
					Ext.Ajax.request({
						url: '<?=$this->baseUrl?>/ajax/userdata',
						success: function(response, opts) {
							var data = Ext.decode(response.responseText);
							var el = Ext.get('qa-panel-userwelcome');
							el.insertHtml('afterBegin', 'Welcome back, ' + data.name);
						}
					});
				}
			}
		},{
			id: 'tb-wq',
			region: 'west',
			collapsible: true,
			collapsed: true,
			width: 400,
			split: true,
			xtype: 'tabpanel',
			border: false,
			frame: false,
			activeTab: 0,
			deferredRender: false,
			items: [new Grid_Workqueue],
			listeners: {
				resize: function () {
				    if (Ext.getCmp('tb-recon')) {
					   Ext.getCmp('tb-recon').doLayout();
				    }
				},
				collapse: function() {
				    if (Ext.getCmp('tb-recon')) {
					   Ext.getCmp('tb-recon').doLayout();
				    }
				}
			}
		},{
			region: (isRemoteAccessSession) ? 'center' : 'east',
			collapsible: (isRemoteAccessSession) ? false : true,
			title: 'RMV',
			autoScroll: true,
			width: (isRemoteAccessSession) ? "100%" : 700,
			split: true,
			items: new FormRMV,
			listeners: {
				resize: function () {
				    if (Ext.getCmp('tb-recon')) {
					   Ext.getCmp('tb-recon').doLayout();
				    }
				},
				collapse: function() {
				    if (Ext.getCmp('tb-recon')) {
					   Ext.getCmp('tb-recon').doLayout();
				    }
				}
			}
		},
		commentsPanel
		]
	};

	if (!isRemoteAccessSession) {
	    viewPortConfig.items.push(
            new Ext.TabPanel({
                region: 'center',
                id: 'tb-recon',
                deferredRender: false
            })
	    );
	}

	var vp = new Ext.Viewport(viewPortConfig);
});

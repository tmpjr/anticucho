Ext.onReady(function(){
	Ext.QuickTips.init();

	Window_FileManager = function(config) {
		Ext.apply(this, config);



		Window_FileManager.superclass.constructor.call(this, {
			id: 'win-rmv-filemgr',
			width: 800,
			height: 480,
			modal: true,
			layout: 'fit',
			title: 'RMV Related Files Manager',
			buttonAlign: 'left',
            tbar: [{
				text: 'Close Window',
				iconCls: 'btn-cross',
				handler: function() {
					Ext.getCmp('win-rmv-filemgr').close();
				}
			}],
			bbar: [{
				text: 'Close Window',
				iconCls: 'btn-cross',
				handler: function() {
					Ext.getCmp('win-rmv-filemgr').close();
				}
			}]
		});
	};

	Ext.extend(Window_FileManager, Ext.Window, {

	});
});
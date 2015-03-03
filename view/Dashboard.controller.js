jQuery.sap.require("sap.m.MessageToast");

sap.ui.controller("sap.cd.ui5.demo.view.Dashboard", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf sap.cd.ui5.demo.view.Dashboard
*/
	onInit: function() {
        // var oJsonModel = new sap.ui.model.json.JSONModel();
        // oJsonModel.setJSON('{"EmployeeSet": [{"Empid":"10001", "Empname":"test01"},{"Empid":"10002", "Empname":"test02"},{"Empid":"10003", "Empname":"test03"}]}');

        // set data model
        var sServiceURL = "/sap/opu/odata/SAP/ZMM_EMP_WY_SRV";
        oModel = new sap.ui.model.odata.ODataModel(sServiceURL, true);
        sap.ui.getCore().setModel(oModel);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf sap.cd.ui5.demo.view.Dashboard
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.http://mo-6206a6c7e.mo.sap.corp:50000/sap/opu/odata/SAP/ZMM_EMP_WY_SRV
;
var oModel =    new sap.ui.model.odata.ODataModel(sServiceURL, true);

var oJsonModel = new sap.ui.model.json.JSONModel();

oModel.read("/EmployeeSet?), null, null, true, function(oData, response){
    oJsonModel.setData(oData);
}*; @memberOf sap.cd.ui5.demo
sap.ui.getCore().setModel(oJsonModel);.view.Dashboard
*/
// 	onAfterRendering: function() {
//         var msg ="This a Message Toast!";
//         sap.m.MessageToast.show(msg);
// 	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf sap.cd.ui5.demo.view.Dashboard
*/
//	onExit: function() {
//
//	}
    
    onItemPress: function(evt){
        // var msg ="This a Message Toast!";
        // sap.m.MessageToast.show(msg);
        var oDialog = sap.ui.getCore().byId("Dialog");
        if (!oDialog) {
            oDialog = sap.ui.xmlfragment("sap.cd.ui5.demo.view.Dialog", this);
        }
        oDialog.open();

        var sID = evt.getSource().getBindingContext().getProperty("Empid"); 
 	    var sName = evt.getSource().getBindingContext().getProperty("Empname"); 
 	    var sAddr = evt.getSource().getBindingContext().getProperty("Empadd"); 
 	    var sDes = evt.getSource().getBindingContext().getProperty("Empdes"); 

        sap.ui.getCore().byId('id').setValue(sID);
        sap.ui.getCore().byId('name').setValue(sName);
        sap.ui.getCore().byId('addr').setValue(sAddr);
        sap.ui.getCore().byId('des').setValue(sDes);
        sap.ui.getCore().byId("id").setEnabled(false);
        sap.ui.getCore().byId('btnUpdate').setVisible(true);
        sap.ui.getCore().byId('btnDelete').setVisible(true);
        sap.ui.getCore().byId('btnCreate').setVisible(false);
        sap.ui.getCore().byId('btnCancel').setVisible(true);
    },
    
    NewEntry: function(){
        var oDialog = sap.ui.getCore().byId("Dialog");
        if (!oDialog) {
            oDialog = sap.ui.xmlfragment("sap.cd.ui5.demo.view.Dialog", this);
        }
        oDialog.open();
        
        sap.ui.getCore().byId('id').setValue("");
        sap.ui.getCore().byId('name').setValue("");
        sap.ui.getCore().byId('addr').setValue("");
        sap.ui.getCore().byId('des').setValue("");
        sap.ui.getCore().byId("id").setEnabled(true);
        sap.ui.getCore().byId('btnUpdate').setVisible(false);
        sap.ui.getCore().byId('btnDelete').setVisible(false);
        sap.ui.getCore().byId('btnCreate').setVisible(true);
        sap.ui.getCore().byId('btnCancel').setVisible(true);
    },
    
    
    mode: 0,
    
    onUpdateButton: function(){
        this.mode = 'update';
        this.save();
    },
    
    onDeleteButton: function(){
        this.mode = "delete";
        this.save();
    },
    
    onCreateButton: function(){
        this.mode = "create";
        this.save();
    },
    
    save: function(){
        var oEmployee = {};
        oEmployee.Empid = sap.ui.getCore().byId("id").getValue();
        oEmployee.Empname = sap.ui.getCore().byId("name").getValue();
        oEmployee.Empadd = sap.ui.getCore().byId("addr").getValue();
        oEmployee.Empdes = sap.ui.getCore().byId("des").getValue();
        
        // WAY ONE: Use OData Write Support
        if(this.mode === 'create'){
            var url = "/EmployeeSet";
            
            oModel.create(url, oEmployee, null, function(data) {
    			sap.ui.getCore().byId("Dialog").close();
    			sap.m.MessageToast.show('Add Employee Succeessfully!');
    		}, function(err) {
    			//Error Callback:
    			alert("Error occurred " + err.message);
    		});            
        }else if(this.mode == 'update'){
            var url = "/EmployeeSet('"+ oEmployee.Empid +"')";

            oModel.update(url, oEmployee, null, function(data) {
    			sap.ui.getCore().byId("Dialog").close();
    			sap.m.MessageToast.show('Update Employee Succeessfully!');
    		}, function(err) {
    			//Error Callback:
    			alert("Error occurred " + err.message);
    		});
        }else if(this.mode == 'delete') {
            var url = "/EmployeeSet('"+ oEmployee.Empid +"')";

            oModel.remove(url, null, function(data) {
    			sap.ui.getCore().byId("Dialog").close();
    			sap.m.MessageToast.show('Delete Employee Succeessfully!');
    		}, function(err) {
    			//Error Callback:
    			alert("Error occurred " + err.message);
    		});
        }           
        
        // WAY TWO: USE ODATA REQUEST
        // var requestObj = {
        //         requestUri: '',
        //         method: '',
        //         headers: {
        //             "X-Requested-With" : "XMLHttpRequest",
        //             "Content-Type" : "application/json",
        //             "DataServiceVersion" : "2.0",
        //             "MaxDataServiceVersion" : "2.0",
        //             "Accept" : "application/json",
        //             "X-CSRF-Token" : ''
        //         }
        //     };
            
        // if(this.mode === 'create'){
        //     var url = "/sap/opu/odata/SAP/ZMM_EMP_WY_SRV/EmployeeSet";
        //     var method = "POST";

        //     requestObj.requestUri = url;
        //     requestObj.method = method;
        //     requestObj.data = oEmployee;
        // }else if(this.mode == 'update'){
        //     var url = "/sap/opu/odata/SAP/ZMM_EMP_WY_SRV/EmployeeSet('"+ oEmployee.Empid +"')";
        //     var method = "PUT";

        //     requestObj.requestUri = url;
        //     requestObj.method = method;
        //     requestObj.data = oEmployee;
        // }else if(this.mode == 'delete') {
        //     var url = "/sap/opu/odata/SAP/ZMM_EMP_WY_SRV/EmployeeSet('"+ oEmployee.Empid +"')";
        //     var method = "DELETE";
            
        //     requestObj.requestUri = url;
        //     requestObj.method = method;
        //     requestObj.data = oEmployee;
        // }   
        
        // OData.request({
        //     requestUri: "/sap/opu/odata/SAP/ZMM_EMP_WY_SRV",
        //     method: "GET",
        //     headers: {
        //             "X-Requested-With" : "XMLHttpRequest",
        //             "X-CSRF-Token" : "Fetch"
        //         }
        //     }, function(data, response){
        //         requestObj.headers['X-CSRF-Token'] = response.headers['x-csrf-token'];
                
        //         OData.request(requestObj, function(){
        //             sap.ui.getCore().getModel().refresh();
        //             sap.ui.getCore().byId("Dialog").close();
        //             sap.m.MessageToast.show('Add/Modify Employee Succeessfully!');
        //         });
        //     });
    },
    
    onCancelButton: function(){
        sap.ui.getCore().byId("Dialog").close();
    }

});
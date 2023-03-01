

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            cmbcustomorder.addEventListener("change",cmbcustomorderMC);
            cmbproduct.addEventListener("change",cmbproductMC);
            cmbdelivery.addEventListener("change",cmbdeliveryMC);

            privilages = httpRequest("../privilage?module=DELIVERYORDERCONFIRM","GET");
            deliverystatus = httpRequest("../deliverystatus/list", "GET");
            corders = httpRequest("../customerorder/list","GET");
            deliveries = httpRequest("../delivery/list","GET");
            products = httpRequest("../product/list","GET");
            employees = httpRequest("../employee/list", "GET");

            valid = "2px solid green";
            invalid = "2px solid red";
            initial = "2px solid #d6d6c2";
            updated = "2px solid #ff9900";
            active = "#ff9900";

            loadForm();
        }
        function cmbcustomorderMC(){
            listofcustomerorderproduct=[];
            listofproductdetails=[];
            listofcustomerorderproduct = httpRequest("../deliveryhascorder/listofdeliverycorders?customerorderid="+JSON.parse(cmbcustomorder.value).id, "GET");
            listofproductdetails = httpRequest("../product/listbyproduct?corderid="+JSON.parse(cmbcustomorder.value).id, "GET");
            if (listofproductdetails.length!=0){
                fillCombo(cmbproduct, "Select Product", listofproductdetails, "productname", "");
                cmbproduct.disabled=false;
            }else {
                cmbproduct.disabled=true;
                console.log(listofcustomerorderproduct)
                txtqty.value="";
                txtcontactname.value="";
                txtcontactmobile.value="";
                txtaddress.value="";
                txtqty.style.border = initial;

                txtqty.value = listofcustomerorderproduct[0].qty;
                txtcontactname.value = listofcustomerorderproduct[0].cpname;
                txtcontactmobile.value = listofcustomerorderproduct[0].cpmobile;
                txtaddress.value = listofcustomerorderproduct[0].address;

                customerdeliverconfirm.qty = txtqty.value;
                customerdeliverconfirm.cpname = txtcontactname.value;
                customerdeliverconfirm.cpmobile = txtcontactmobile.value;
                customerdeliverconfirm.address = txtaddress.value;

                txtqty.style.border = valid;
                txtcontactname.style.border = valid;
                txtcontactmobile.style.border = valid;
                txtaddress.style.border = valid;
            }
        }

        function cmbproductMC(){
            listofproductqty=[];
            listofproductqty = httpRequest("../customerorderhasproduct/listofproductqty?customerorderid="+JSON.parse(cmbcustomorder.value).id+"&productid="+JSON.parse(cmbproduct.value).id, "GET");
            txtqty.value =  listofproductqty[0].qty;
            txtcontactname.value =  listofproductqty[0].cpname;
            txtcontactmobile.value =  listofproductqty[0].cpmobile;
            txtaddress.value =  listofproductqty[0].address;
            txtqty.style.border = valid;
            txtcontactname.style.border = valid;
            txtcontactmobile.style.border = valid;
            txtaddress.style.border = valid;

            customerdeliverconfirm.qty = txtqty.value;
            customerdeliverconfirm.cpname = txtcontactname.value;
            customerdeliverconfirm.cpmobile = txtcontactmobile.value;
            customerdeliverconfirm.address = txtaddress.value;

        }

        function cmbdeliveryMC(){
            customerorderbyselectingdeliver = httpRequest("/customerorder/listofordersbyselecteddelivery?deliverid="+JSON.parse(cmbdelivery.value).id ,"GET");
            fillCombo(cmbcustomorder,"Select Order",customerorderbyselectingdeliver,"cordercode","");

            console.log(customerorderbyselectingdeliver);
            cmbproduct.value="";
            txtqty.value="";
            txtcontactname.value="";
            txtcontactmobile.value="";
            txtaddress.value="";

            cmbcustomorder.style.border = initial;
            cmbproduct.style.border = initial;
            txtqty.style.border = initial;
            txtcontactname.style.border = initial;
            txtcontactmobile.style.border = initial;
            txtaddress.style.border = initial;

            customerdeliverconfirm.product_id = null;
            customerdeliverconfirm.qty = null;
            customerdeliverconfirm.cpname = null;
            customerdeliverconfirm.cpmobile = null;
            customerdeliverconfirm.address = null;

            customerdeliverconfirm = JSON.parse(cmbdelivery.value);

            customerdeliverconfirm.confirmby_id = JSON.parse(cmbconfirmby.value);
            customerdeliverconfirm.confirmdate  = cmbconfirmdate.value;

        }

        function loadForm() {
            customerdeliverconfirm = new Object();
            oldcustomerdeliverconfirm = null;

            fillCombo(cmbdelivery,"Select Deliver Code",deliveries,"deliverycode","");
            fillCombo(cmbcustomorder,"Select Order",corders,"cordercode","");
            fillCombo(cmbproduct,"Select Product",products,"productname","");

            fillCombo(cmbconfirmby, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
            cmbconfirmby.disabled = true;


            cmbconfirmdate.value= getCurrentDateTime("datetime");
            cmbconfirmdate.disabled = true;


            setStyle(initial);
            cmbconfirmdate.style.border = valid;
            cmbconfirmby.style.border = valid;

            cmbcustomorder.value="";
            cmbproduct.value="";
            txtqty.value="";

            txtcontactname.value="";
            txtcontactmobile.value="";
            txtaddress.value="";
            disableButtons(false, true, true);

        }

        function setStyle(style) {

            cmbcustomorder.style.border = style;
            cmbdelivery.style.border = style;
            cmbproduct.style.border = style;
            txtqty.style.border = style;
            cmbconfirmdate.style.border = style;
            cmbconfirmby.style.border = style;
            txtcontactname.style.border = style;
            txtcontactmobile.style.border = style;
            txtaddress.style.border = style;

        }
        function disableButtons(add, upd, del){

            if (add || !privilages.add) {
                btnAdd.setAttribute("disabled", "disabled");
                $('#btnAdd').css('cursor','not-allowed');
            }
            else {
                btnAdd.removeAttribute("disabled");
                $('#btnAdd').css('cursor','pointer')
            }

         /*   if (upd || !privilages.update) {
                btnUpdate.setAttribute("disabled", "disabled");
                $('#btnUpdate').css('cursor','not-allowed');
            }
            else {
                btnUpdate.removeAttribute("disabled");
                $('#btnUpdate').css('cursor','pointer');
             }*/

            if (!privilages.update) {
                $(".buttonup").prop('disabled', true);
                $(".buttonup").css('cursor','not-allowed');
            }
            else {
                $(".buttonup").removeAttr("disabled");
                $(".buttonup").css('cursor','pointer');
            }

            if (!privilages.delete){
                $(".buttondel").prop('disabled', true);
                $(".buttondel").css('cursor','not-allowed');
            }
            else {
                $(".buttondel").removeAttr("disabled");
                $(".buttondel").css('cursor','pointer');
            }

        }

        function getErrors() {

            var errors = "";
            addvalue = "";

            if (customerdeliverconfirm.corder_id == null){
                errors = errors + "\n" + "Customer Order Not Enter";
                cmbcustomorder.style.border = invalid;
            }
            else  addvalue = 1;

            if (listofcustomerorderproduct.product_id!=null){
                if (customerdeliverconfirm.product_id == null){
                    errors = errors + "\n" + "Product is Not Selected";
                    cmbproduct.style.border = invalid;
                }
                else  addvalue = 1;
            }

            if (customerdeliverconfirm.qty == null){
                errors = errors + "\n" + "Qty is Not Selected";
                txtqty.style.border = invalid;
            }
            else  addvalue = 1;

            if (customerdeliverconfirm.confirmdate == null){
                errors = errors + "\n" + "Confirm Date Not Enter";
                cmbconfirmdate.style.border = invalid;
            }
            else  addvalue = 1;
            if (customerdeliverconfirm.confirmby_id == null){
                errors = errors + "\n" + "Added By Not Enter";
                cmbconfirmby.style.border = invalid;
            }
            else  addvalue = 1;

            if (customerdeliverconfirm.cpname == null){
                errors = errors + "\n" + "Contact Person Name";
                txtcontactname.style.border = invalid;
            }
            else  addvalue = 1;
            if (customerdeliverconfirm.cpmobile == null){
                errors = errors + "\n" + "Contact Person Mobile";
                txtcontactmobile.style.border = invalid;
            }
            else  addvalue = 1;
            if (customerdeliverconfirm.address == null){
                errors = errors + "\n" + "Delivery Address";
                txtaddress.style.border = invalid;
            }
            else  addvalue = 1;

            return errors;

        }

        function btnAddMC(){
            if(getErrors()==""){
                savedata();
            }else{
                swal({
                    title: "You have following errors",
                    text: "\n"+getErrors(),
                    icon: "error",
                    button: true,
                });

            }
        }
        
        function savedata() {

            console.log(customerdeliverconfirm);
            var alldilervery = true;
            //customerdeliveryconfirm eka samanai delivery object ekata samana kara
                for(var index in customerdeliverconfirm.deliveryHasCorderList){
                    if(cmbproduct.value == "" && cmbcustomorder.value != ""){
                        if(customerdeliverconfirm.deliveryHasCorderList[index].corder_id.id == JSON.parse(cmbcustomorder.value).id ){
                            customerdeliverconfirm.deliveryHasCorderList[index].deliverystatus_id = deliverystatus[0];
                        }
                    }// 2 --> On-going 1--> Completed
                    if(cmbproduct.value != "" && cmbcustomorder.value != ""){
                        if(customerdeliverconfirm.deliveryHasCorderList[index].corder_id.id == JSON.parse(cmbcustomorder.value).id && customerdeliverconfirm.deliveryHasCorderList[index].product_id.id == JSON.parse(cmbproduct.value).id  ){
                            customerdeliverconfirm.deliveryHasCorderList[index].deliverystatus_id = deliverystatus[0];
                        }
                    }

                    if(customerdeliverconfirm.deliveryHasCorderList[index].deliverystatus_id.id != deliverystatus[1])
                        alldilervery = false;
                }
                if(alldilervery){
                    customerdeliverconfirm.deliverystatus_id = deliverystatus[0];
                }else customerdeliverconfirm.deliverystatus_id = deliverystatus[1];

            swal({
                title: "Are you sure to add following Delivery Confirmation...?" ,
                  text :
                    "\nCustomer Order : " + customerdeliverconfirm.corder_id.cordercode+
                    "\nCustomer Qty : " + customerdeliverconfirm.qty+
                    "\nCustomer Confirm Date : " + customerdeliverconfirm.confirmdate+
                    "\nAdded By : " + customerdeliverconfirm.confirmby_id.callingname,

                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/deliveryconfirm", "PUT", customerdeliverconfirm);
                    if (response == "0") {
                        swal({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been Done \n Save SuccessFully..!',
                            text: '\n',
                            button: false,
                            timer: 1200
                        });
                        activerowno = 1;
                       // loadForm();
                    }
                    else swal({
                        title: 'Save not Success... , You have following errors', icon: "error",
                        text: '\n ' + response,
                        button: true
                    });
                }
            });

        }

        function btnClearMC() {
            //Get Cofirmation from the User window.confirm();
            checkerr = getErrors();

            if(oldcustomerdeliverconfirm== null && addvalue == ""){
                loadForm();
            }else{
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        loadForm();
                    }

                });
            }

        }

        function btnClearMC() {
            //Get Cofirmation from the User window.confirm();
            checkerr = getErrors();

            if (oldcustomerdeliverconfirm == null && addvalue == "") {
                loadForm();
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n",
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        loadForm();
                    }

                });
            }

        }



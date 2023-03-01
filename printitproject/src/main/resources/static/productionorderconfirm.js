

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);

            cmbproductorderlist.addEventListener("change",cmbproductorderlistCH);

            privilages = httpRequest("../privilage?module=PRODUCTIONORDERCONFIRM","GET");

            productionorders = httpRequest("../productionorder/list","GET");
            confirmby = httpRequest("../employee/list","GET");

            valid = "2px solid green";
            invalid = "2px solid red";
            initial = "2px solid #d6d6c2";
            updated = "2px solid #ff9900";
            active = "#ff9900";

            loadForm();
        }

        function cmbproductorderlistCH(){

            // equaling to product object to productionordercomfirm object
            productionorderconfirm =  JSON.parse(cmbproductorderlist.value);
            productionorderconfirm.confirmdate = confirmdate.value; // <---- This date is current date
            confirmdate.style.border = valid;

            productionorderconfirm.confirm_employee_id = JSON.parse(confirmBy.value);
            confirmBy.style.border = valid;

            //get the list of the production-order-has-product table from cmbproductorderlist object
            productionorderconfirm.productionorderHasProductList = JSON.parse(cmbproductorderlist.value).productionorderHasProductList;

            //Production-Order-Product Detail table will be fill
            fillInnerTable("tblInnerPorderProductdetail", productionorderconfirm.productionorderHasProductList, false, false, true);

            //-------------------------

            //set a new array for all material list
            allmateriallist = new Array();
            for (var index in productionorderconfirm.productionorderHasProductList){
                // get a service for material by providing product id -----> from (product has material table)
                listofproducthasmaterial =  httpRequest("/producthasmaterial/listbyproduct?productid=" + productionorderconfirm.productionorderHasProductList[index].product_id.id, "GET" );

                // read one by one of this product has material table list by below enhance for loop
                for (var ind in listofproducthasmaterial){
                    // create a new object to set those importance properties
                    allmaterial = new Object();
                    // -----> set new value to this object.properties from (listofproducthasmaterial) of that service object
                    allmaterial.material_id = listofproducthasmaterial[ind].material_id;
                    allmaterial.qty = parseFloat(listofproducthasmaterial[ind].qty) * parseFloat(productionorderconfirm.productionorderHasProductList[index].qty);// <----require quantity
                    allmateriallist.push(allmaterial); // push the created object into this new array
                }
            }

            // create a array ----> to check duplicated material names. if there any duplicated material names , qty of those to arrays will be mul
            allmaterialswithoutduplicates = new Array();

            //read above product-has-material list object one by one
            for (var inde in allmateriallist){
                var i=0; var matext = false;
                //read new array one by one -----> if this reading at first time this for loop will not executed.
                for (var ind in allmaterialswithoutduplicates){
                    // check the duplicated material names of this two array
                    if(allmaterialswithoutduplicates[ind].material_id.id == allmateriallist[inde].material_id.id){
                        matext = true; break;
                    }
                    i++;
                }
                if(matext){
                    // if this matext is true above qty will be multiple to this new array qty
                    allmaterialswithoutduplicates[i].qty = parseFloat(allmaterialswithoutduplicates[i].qty) + parseFloat(allmateriallist[inde].qty);
                }else{
                    // if its false push the object into created array
                    allmaterialswithoutduplicates.push(allmateriallist[inde]);
                }
            }
            // again we have to read the created array one by one to
            for (var index in allmaterialswithoutduplicates) {
                // get the service from material inventory table to get the available quantity
                inventoryhasmaterial = httpRequest("/materialinventory/bymaterial?materialid=" + allmaterialswithoutduplicates[index].material_id.id, "GET");
                // set the material inventory quantity value to this below array instance by aqty property
                allmaterialswithoutduplicates[index].aqty = inventoryhasmaterial.avaqty;
            }
            // fill the table
            fillInnerTable("tblInneMproductionorderProduct", allmaterialswithoutduplicates, false, false, true);

            var checkbuttondisable = false;
            for (var qtycheck in allmaterialswithoutduplicates){
                console.log(allmaterialswithoutduplicates[qtycheck].aqty)
                if (parseFloat(allmaterialswithoutduplicates[qtycheck].aqty) < parseFloat(allmaterialswithoutduplicates[qtycheck].qty)){
                    checkbuttondisable = true;
                    break;
                }
            }
            if (checkbuttondisable){
                btnAdd.disabled = true;

            }else {
                btnAdd.disabled = false;
                productionorderconfirm.productionorderHasMaterialList = allmaterialswithoutduplicates;
            }

            //disableButtons(false, true, true);
        }
        function loadForm() {
            productionorderconfirm = new Object();
            oldproductionorderconfirm = null;

            fillCombo(cmbproductorderlist,"Select Production Order",productionorders,"productionordercode","");
            fillCombo(confirmBy,"",confirmby,"callingname",session.getObject('activeuser').employeeId.callingname);
            confirmBy.disabled = true;

            confirmdate.value= getCurrentDateTime("date");
            confirmdate.disabled = true;

            cmbproductorderlist.value = "";

            setStyle(initial);

            allmaterialswithoutduplicates= [];
            productionorderconfirm.productionorderHasProductList = [];

            fillInnerTable("tblInneMproductionorderProduct", allmaterialswithoutduplicates, false, false, true);
            fillInnerTable("tblInnerPorderProductdetail", productionorderconfirm.productionorderHasProductList, false, false, true);

            disableButtons(false, true, true);

        }

        function setStyle(style) {

            cmbproductorderlist.style.border = style;
            confirmBy.style.border = style;
            confirmdate.style.border = style;

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

            if (productionorderconfirm.productionordercode == null){
                errors = errors + "\n" + " Production Order Code Not Seleccted";
                cmbproductorderlist.style.border = invalid;
            }
            else  addvalue = 1;

            if (productionorderconfirm.confirmdate == null){
                errors = errors + "\n" + "Confirm Date Not Enter";
                confirmdate.style.border = invalid;
            }
            else  addvalue = 1;

            if (productionorderconfirm.confirm_employee_id == null){
                errors = errors + "\n" + " Added By Not Enter";
                confirmBy.style.border = invalid;
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

            swal({
                title: "Are you sure to add following Production Order Confirmation...?" ,
                  text :  "\nProduction Order Code : " + productionorderconfirm.productionordercode  +
                    "\nConfirm Date : " + productionorderconfirm.confirmdate +
                    "\nAdded By : " + productionorderconfirm.confirm_employee_id.callingname,

                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/productionorderconfirm", "POST", productionorderconfirm);
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
                        loadForm();
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

            if(oldproductionorderconfirm== null && addvalue == ""){
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



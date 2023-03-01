

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            $('[data-toggle="tooltip"]').tooltip()


            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);

            txtSearchName.addEventListener("keyup",btnSearchMC);
            txtDesignName.addEventListener("keyup",txtDesignNameCH);
            $('.js-example-basic-single').select2();

            //
            //cmbDesignType.addEventListener("change",cmbDesignTypeCH);
            //cmbProductType.addEventListener("change", cmbProductTypeCH);
            //cmbDesignCategory.addEventListener("change", cmbDesignCategoryCH);
            cmbCustomType.addEventListener("change", cmbCustomTypeCH);

            privilages = httpRequest("../privilage?module=PRODUCTDESIGNTYPE","GET");
    
            designCategories = httpRequest("../designcategory/list","GET");
            designTypes = httpRequest("../designtype/list","GET");
            productTypes = httpRequest("../producttype/list","GET");
            customtypes = httpRequest("../customtype/list","GET");
            designers = httpRequest("../employee/list","GET");
            designStatus = httpRequest("../designstatus/list","GET");
            employees = httpRequest("../employee/list","GET");


            valid = "2px solid green";
            invalid = "2px solid red";
            initial = "2px solid #d6d6c2";
            updated = "2px solid #ff9900";
            active = "#ff9900";

            loadView();                      //To Load View Side
            loadForm();                     //To Refresh the Form Side
            $('#formmodel').modal('hide')
        }

        function loadView() {

            //Search Area
            txtSearchName.value="";
            txtSearchName.style.background = "";

            //Table Area
            activerowno = "";
            activepage = 1;
            var query = "&searchtext=";
            loadTable(1,cmbPageSize.value,query);
        }

        function loadTable(page,size,query) {
            page = page - 1;
            productdesigntypes = new Array();
            var data = httpRequest("/productdesigntype/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) productdesigntypes = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblProductdesigntype',productdesigntypes,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblProductdesigntype);

            if(activerowno!="")selectRow(tblProductdesigntype,activerowno,active);

        }

        function paginate(page) {
            var paginate;
            if(oldproductdesign==null){
                paginate=true;
            }else{
                if(getErrors()==''&&getUpdates()==''){
                    paginate=true;
                }else{
                    paginate = window.confirm("Form has Some Errors or Update Values. " +
                        "Are you sure to discard that changes ?");
                }
            }
            if(paginate) {
                activepage=page;
                activerowno=""
                loadForm();
                loadSearchedTable();
            }

        }

        function clearaddphoto(){
            filephoto.value ="";
            imgviewphoto.src = "";
            productdesign.photo = null;
            productdesign.imagename = null;
            picname.value = "";
            imgviewphoto.style.display = "none";
            picname.style.border = "initial";
            picname.disabled = true;

        }

        function viewitem(pdt,rowno) {

            productdesign = JSON.parse(JSON.stringify(pdt));

            tdDcode.innerHTML = productdesign.designcode;
            tdDcategory.innerHTML = productdesign.dcategory_id.name;
            tdPtype.innerHTML = productdesign.producttype_id.name;
            tdDname.innerHTML = productdesign.designname;
            tdDtype.innerHTML = productdesign.dtype_id.name;
            if (productdesign.designer_id != null){
                tdPtdesigner.innerHTML = productdesign.designer_id.callingname;
                tdDcost.innerHTML = productdesign.designcost;
            }else {
                tdDcost.innerHTML = "0.00";
                tdPtdesigner.innerHTML = "-"
            }

            tdCustomtype.innerHTML = productdesign.customtype_id.name;
            tdAdate.innerHTML = productdesign.addeddate;
            tdDescription.innerHTML = productdesign.description;
            tdDstatus.innerHTML = productdesign.dstatus_id.name;
            tdEmployee.innerHTML = productdesign.employee_id.callingname;


            if(productdesign.photo==null)
                tdphoto.src= 'resources/image/noimage.png';
             else
                tdphoto.src = atob(productdesign.photo);

            $('#dataviewModal').modal('show')

         }

         function btnprintrowMC(){
             var format = printformtable.outerHTML;

             var newwindow=window.open();
             newwindow.document.write("<html>" +
                 "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
                 "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'></head>" +
                 "<body><div style='margin-top: 150px'><h1> Product Design Details :</h1></div>" +
                 "<div>"+format+"</div>" +
                 "<script>printformtable.removeAttribute('style')</script>" +
                 "</body></html>");
             setTimeout(function () {
                 newwindow.print();
                 newwindow.close();
             },100);
         }

        function cmbDesignCategoryCH(){
            fillCombo(cmbProductType,"Select Product Type",productTypes,"name","");
            fillCombo(cmbDesignType,"Select Design Type",designTypes,"name","");
            txtDesignName.value ="";
            cmbProductType.value ="";
            txtDesignName.style.border = initial;

            $("#productdesigntypeselect2parent .select2-container").css('border',initial);
            $("#producttypeselect2parent .select2-container").css('border',initial);
            productdesign.producttype_id = null;
            productdesign.dtype_id = null;
            productdesign.designname = null;
        }

        function cmbDesignTypeCH(){
            changeproducttypebydesigntype = httpRequest("/producttype/listbydesigntype?designtype=" + JSON.parse(cmbDesignType.value).id, "GET");
            fillCombo(cmbProductType,"Select Product Type",changeproducttypebydesigntype,"name","");
            cmbProductType.disabled = false;
            $("#producttypeselect2parent .select2-container").css('border',initial);
            productdesign.producttype_id = null

            txtDesignName.value ="";
            cmbProductType.value ="";
            productdesign.designname = null;
            txtDesignName.style.border = initial;

        }

        function cmbProductTypeCH(){

            if (productdesign.dcategory_id != null &&  productdesign.producttype_id != null){
                txtDesignName.disabled = false;
                txtDesignName.value = productdesign.dcategory_id.name +" " + productdesign.producttype_id.name;
                productdesign.designname = txtDesignName.value;
                txtDesignName.style.border = valid;

                if (oldproductdesign !=null &&  oldproductdesign.designname != productdesign.designname){
                    txtDesignName.style.border = updated;
                }else {
                    txtDesignName.style.border = valid;
                }
            }


        }

        function txtDesignNameCH(){
            var productdesigntypes = httpRequest("/productdesigntype/list","GET");

            for (var index in productdesigntypes){
                if (productdesigntypes[index].designname == productdesign.designname){
                    swal({
                        position: 'center',
                        icon: 'warning',
                        title: 'Design Name already excited',
                        text: '\n',
                        button: false,
                    });
                    console.log("A")
                    txtDesignName.style.border = invalid;
                    productdesign.designname = null;
                }
            }

        }

        function cmbCustomTypeCH(custom){

            if (productdesign.customtype_id.name == "In House"){
                txtDesignCost.disabled = false;
                productdesign.designcost = null;

                fillCombo(cmbDesigner,"",designers,"callingname", session.getObject('activeuser').employeeId.callingname);
                productdesign.designer_id = JSON.parse(cmbDesigner.value);
                cmbDesigner.disabled = true;

            }

            if (productdesign.customtype_id.name == "Customized"){

                cmbDesigner.style.border = initial;
                cmbDesigner.value ="";
                cmbDesigner.disabled = true;
                productdesign.designer_id = null;

                txtDesignCost.disabled = true;
                txtDesignCost.style.border = initial;
                txtDesignCost.value="0.00";
                productdesign.designcost = doDecimal(txtDesignCost.value,2);

            }
        }

        function loadForm() {
            productdesign = new Object();
            oldproductdesign = null;

             fillCombo(cmbDesignCategory,"Select Design Category",designCategories,"name","");
             fillCombo(cmbCustomType,"Select Custom Type",customtypes,"name","");
             fillCombo(cmbProductType,"Select Product Type",productTypes,"name","");
             fillCombo(cmbDesignType,"Select Design Type",designTypes,"name","");
             fillCombo(cmbDesigner,"Select Designer",designers,"callingname", "");

            fillCombo(cmbDesignStatus,"",designStatus,"name","Pending");
            productdesign.dstatus_id = JSON.parse(cmbDesignStatus.value);
            cmbDesignStatus.disabled = true;

            fillCombo(employee,"",employees,"callingname", session.getObject('activeuser').employeeId.callingname);
            productdesign.employee_id = JSON.parse(employee.value);
            employee.disabled = true;

             var today = new Date();
             var month = today.getMonth()+1;
             if(month<10) month = "0"+month;
             var date = today.getDate();
             if(date<10) date = "0"+date;

            txtAddedDate.value=today.getFullYear()+"-"+month+"-"+date;
            productdesign.addeddate = txtAddedDate.value;
            txtAddedDate.disabled = true;

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/productdesigntype/nextNumber", "GET");
            txtDesignCode.value = nextNumber.designcode;
            productdesign.designcode = txtDesignCode.value;
            txtDesignCode.disabled="disabled";
            txtDesignCode.style.border = valid;

            txtDesignName.value = "";
            txtDesignCost.value = "";
            txtDescription.value = "";
            cmbDesignCategory.value = "";
            cmbProductType.value = "";
            cmbDesignType.value = "";
            cmbDesigner.value = "";

             /*removeFile('flePhoto');*/
            filephoto.value ="";
            imgviewphoto.src = "";
            imgviewphoto.style.display = "none";
            picname.disabled = true;
            picname.value ="";

            //Disable Fields Area
            cmbProductType.disabled = true;
            txtDesignName.disabled = true;
            cmbDesigner.disabled = true;
            txtDesignCost.disabled = true;

            setStyle(initial);
            cmbDesignStatus.style.border=valid;
            txtAddedDate.style.border=valid;
            employee.style.border=valid;

            txtDesignCost.value="0.00";

            disableButtons(false, true, true);
        }

        function setStyle(style) {

            $("#productdesigncatselect2parent .select2-container").css('border',style);
            $("#productdesigntypeselect2parent .select2-container").css('border',style);
            $("#producttypeselect2parent .select2-container").css('border',style);
            txtDesignName.style.border = style;
            cmbDesignType.style.border = style;
            cmbDesigner.style.border = style;
            cmbCustomType.style.border = style;
            picname.style.border = style;

            txtDesignCost.style.border = style;
            txtAddedDate.style.border = style;
            txtDescription.style.border = style;
            cmbDesignStatus.style.border = style;

        }

        function disableButtons(add, upd, del) {

            if (add || !privilages.add) {
                btnAdd.setAttribute("disabled", "disabled");
                $('#btnAdd').css('cursor','not-allowed');
            }
            else {
                btnAdd.removeAttribute("disabled");
                $('#btnAdd').css('cursor','pointer')
            }

            if (upd || !privilages.update) {
                btnUpdate.setAttribute("disabled", "disabled");
                $('#btnUpdate').css('cursor','not-allowed');
            }
            else {
                btnUpdate.removeAttribute("disabled");
                $('#btnUpdate').css('cursor','pointer');
             }

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

            // select deleted data row
            for(index in productdesigntypes){
                if(productdesigntypes[index].dstatus_id.name =="Deleted"){
                    tblProductdesigntype.children[1].children[index].style.color = "#f00";
                    tblProductdesigntype.children[1].children[index].style.border = "3px solid red";
                    tblProductdesigntype.children[1].children[index].lastChild.children[1].disabled = true;
                    tblProductdesigntype.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }

        function getErrors() {

            var errors = "";
            addvalue = "";

            if (productdesign.designcode == null) {
                txtDesignCode.style.border = invalid;
                errors = errors + "\n" + "Design Code Not Enter";
            }
            else  addvalue = 1;

            if (productdesign.dcategory_id == null){
                $("#productdesigncatselect2parent .select2-container").css('border',invalid);
                errors = errors + "\n" + "Design Category Not Selected";
            }
            else  addvalue = 1;

            if (productdesign.dtype_id == null){
                $("#productdesigntypeselect2parent .select2-container").css('border',invalid);
                errors = errors + "\n" + "Design Type Not Selected ";
            }
            else  addvalue = 1;

            if (productdesign.producttype_id == null){
                $("#producttypeselect2parent .select2-container").css('border',invalid);
                errors = errors + "\n" + "Product Type Not Selected";
            }
            else  addvalue = 1;

            if (productdesign.designname == null){
                txtDesignName.style.border = invalid;
                errors = errors + "\n" + "Design Name Not Enter";
            }
            else  addvalue = 1;

            if (productdesign.customtype_id == null){
                cmbCustomType.style.border = invalid;
                errors = errors + "\n" + "Custom Type Not Selected ";
            }
            else  addvalue = 1;

            if (productdesign.customtype_id == null || productdesign.customtype_id.name == "In House"){

                if (productdesign.designer_id == null){
                    cmbDesigner.style.border = invalid;
                    errors = errors + "\n" + "Designer Not Selected ";
                }
                else  addvalue = 1;

                if (productdesign.designcost == null){
                    txtDesignCost.style.border = invalid;
                    errors = errors + "\n" + "Design Cost Not Enter ";
                }
                else  addvalue = 1;
            }
            if (productdesign.imagename == null){
                picname.style.border = invalid;
                errors = errors + "\n" + "Image & Image-Name Not Selected";
            }
            else  addvalue = 1;

            if (productdesign.dstatus_id == null){
                cmbDesignStatus.style.border = invalid;
                errors = errors + "\n" + "Status Not Selected";
            }
            else  addvalue = 1;

            return errors;
        }

        function btnAddMC(){
            if(getErrors()==""){
                if(txtDescription.value=="" || cmbDesigner.value =="" || txtDesignCost.value==""){
                    swal({
                        title: "Are you sure to continue...?",
                        text: "Form has some empty fields.....",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    }).then((willDelete) => {
                        if (willDelete) {
                            savedata();
                        }
                    });

                }else{
                    savedata();
                }
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
                title: "Are you sure to add following Product Design Type...?" ,
                  text :"\nDesign Code : " + productdesign.designcode +
                    "\nDesign Name : " + productdesign.designname +
                    "\nDesign Cost : " + productdesign.designcost +
                    "\nAdded Date : " + productdesign.addeddate +
                    "\nDesign type : " + productdesign.dtype_id.name +
                    "\nProduct type : " + productdesign.producttype_id.name +
                    "\nDesign Category : " + productdesign.dcategory_id.name +
                    "\nCustom Type : " + productdesign.customtype_id.name +
                    "\nDesign Status : " + productdesign.dstatus_id.name +
                    "\nEmployee : " + productdesign.employee_id.callingname,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/productdesigntype", "POST", productdesign);
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
                        activepage = 1;
                        loadSearchedTable();
                        loadForm();
                        $('#formmodel').modal('hide')
                    }
                    else
                        swal({
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

            if(oldproductdesign == null && addvalue == ""){
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

        function fillForm(pdt,rowno){
            activerowno = rowno;


            if (oldproductdesign == null) {
                filldata(pdt);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(pdt);

                    }

                });
            }

        }


        function filldata(pdt) {
            clearSelection(tblProductdesigntype);
            selectRow(tblProductdesigntype,activerowno,active);

            productdesign = JSON.parse(JSON.stringify(pdt));
            oldproductdesign = JSON.parse(JSON.stringify(pdt));

            txtDesignCode.value = productdesign.designcode;
            txtDesignName.value = productdesign.designname;
            txtAddedDate.value = productdesign.addeddate;
            txtDescription.value = productdesign.description;

            //photo area fill --> if there any photo in selected row display them in the model view
            if (productdesign.photo != null){
                imgviewphoto.src = atob(productdesign.photo);
                picname.value = productdesign.imagename;
                picname.style.border = valid;
            }else
                imgviewphoto.src = 'resources/images/noimage.png';
                imgviewphoto.style.display = "block";

            fillCombo(cmbDesignCategory, "Select Category", designCategories, "name", productdesign.dcategory_id.name);
            fillCombo(cmbDesignType, "Select Design Type", designTypes, "name", productdesign.dtype_id.name);

            // filter product type
            changeproducttypebydesigntype = httpRequest("/producttype/listbydesigntype?designtype=" + JSON.parse(cmbDesignType.value).id, "GET");
            fillCombo(cmbProductType, "Select Product Type", changeproducttypebydesigntype, "name", productdesign.producttype_id.name);

            fillCombo(cmbCustomType, "Select Custom Type", customtypes, "name", productdesign.customtype_id.name);

            // if customer designer not empty above statement will run --> field will be fill with old value and the cots
            if(productdesign.designer_id != null){
                fillCombo(cmbDesigner, "Select Designer", designers, "callingname",productdesign.designer_id.callingname );
                txtDesignCost.value = productdesign.designcost;
            }
            else {
                // if not same list of the desiner will see and cost = 0 ;
                fillCombo(cmbDesigner, "Select Designer", designers, "callingname", "");
                txtDesignCost.value="0.00";
            }

            fillCombo(employee,"",employees,"callingname", productdesign.employee_id.callingname);
            fillCombo(cmbDesignStatus, "", designStatus, "name", productdesign.dstatus_id.name);
            cmbDesignStatus.disabled = false;
            cmbDesigner.disabled=false;

            /*setDefaultFile('flePhoto', employee.photo);*/

            disableButtons(true, false, false);
            setStyle(valid);
            $('#formmodel').modal('show')
            cmbCustomTypeCH();

            if (productdesign.description==null){
                txtDescription.style.border = initial;
            }

            if (productdesign.designer_id==null){
                cmbDesigner.style.border = initial;
            }

            if (productdesign.designcost==null){
                txtDesignCost.style.border = initial;
            }

        }

        function getUpdates() {

            var updates = "";

            if(productdesign!=null && oldproductdesign!=null) {

                if (productdesign.designcode != oldproductdesign.designcode)
                    updates = updates + "\nDesign Code is Changed.." + oldproductdesign.designcode + " into " + productdesign.designcode;

                if (productdesign.dcategory_id.name != oldproductdesign.dcategory_id.name)
                    updates = updates + "\nDesign Category is Changed.." + oldproductdesign.dcategory_id.name + " into " + productdesign.dcategory_id.name;

                if (productdesign.dtype_id.name != oldproductdesign.dtype_id.name)
                    updates = updates + "\nDesign Type is Changed.." + oldproductdesign.dtype_id.name + " into " + productdesign.dtype_id.name;

                if (productdesign.producttype_id.name != oldproductdesign.producttype_id.name)
                    updates = updates + "\nProduct Type is Changed.." + oldproductdesign.producttype_id.name + " into " + productdesign.producttype_id.name;

                if (productdesign.designname != oldproductdesign.designname)
                    updates = updates + "\Design Name is Changed.." + oldproductdesign.designname + " into " + productdesign.designname;

                if (productdesign.customtype_id.name != oldproductdesign.customtype_id.name)
                    updates = updates + "\nCustom Type is Changed.." + oldproductdesign.customtype_id.name + " into " + productdesign.customtype_id.name;

                if (productdesign.designer_id != null && oldproductdesign.designer_id != null){
                    if (productdesign.designer_id.callingname != oldproductdesign.designer_id.callingname)
                        updates = updates + "\nDesigner is Changed.." + oldproductdesign.designer_id.callingname + " into " + productdesign.designer_id.callingname;
                }

                if (productdesign.photo != oldproductdesign.photo){
                    updates = updates + "\nImage Design is Changed.."
                }

                if (productdesign.imagename != oldproductdesign.imagename)
                    updates = updates + "\nImage Name is Changed.."            + oldproductdesign.imagename + " into " + productdesign.imagename;

                if (productdesign.designcost != oldproductdesign.designcost)
                    updates = updates + "\nCost is Changed.." + oldproductdesign.designcost + " into " + productdesign.designcost;

                if (productdesign.description != oldproductdesign.description)
                    updates = updates + "\nDescription is Changed.." + oldproductdesign.description + " into " + productdesign.description;

                if (productdesign.addeddate != oldproductdesign.addeddate)
                    updates = updates + "\nDate is Changed.." + oldproductdesign.addeddate + " into " + productdesign.addeddate;

                if (productdesign.dstatus_id.name != oldproductdesign.dstatus_id.name)
                    updates = updates + "\nStatus is Changed.." + oldproductdesign.dstatus_id.name + " into " + productdesign.dstatus_id.name;

                if (productdesign.employee_id.callingname != oldproductdesign.employee_id.callingname)
                    updates = updates + "\nEmployee is Changed.." + oldproductdesign.employee_id.callingname + " into " + productdesign.employee_id.callingname;

            }

            return updates;

        }

        function btnUpdateMC() {
            var errors = getErrors();
            if (errors == "") {
                var updates = getUpdates();
                if (updates == "")
                    swal({
                    title: 'Nothing Updated..!',icon: "warning",
                    text: '\n',
                    button: false,
                    timer: 1200});
                else {
                    swal({
                        title: "Are you sure to update following Product Design details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/productdesigntype", "PUT", productdesign);
                            if (response == "0") {
                                swal({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'Your work has been Done \n Update SuccessFully..!',
                                    text: '\n',
                                    button: false,
                                    timer: 1200
                                });
                                loadSearchedTable();
                                loadForm();
                                $('#formmodel').modal('hide')

                            }
                            else
                                swal({
                                    title: 'Failed to Update as',icon: "error",
                                    text: '\n '+ response,
                                    button: true});
                        }
                        });
                }
            }
            else
                swal({
                    title: 'You have following errors in your form',icon: "error",
                    text: '\n '+getErrors(),
                    button: true});

        }

        function btnDeleteMC(pdt) {
            productdesign = JSON.parse(JSON.stringify(pdt));

            swal({
                title: "Are you sure to delete following Product Design...?",
                text: "\n Design Code : " + productdesign.designcode +
                "\n Design Type  : " + productdesign.dtype_id.name,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/productdesigntype","DELETE",productdesign);
                    if (responce==0) {
                        swal({
                            title: "Deleted Successfully....!",
                            text: "\n\n  Status change to delete",
                            icon: "success", button: false, timer: 1200,
                        });
                        loadSearchedTable();
                        loadForm();
                    } else {
                        swal({
                            title: "You have following erros....!",
                            text: "\n\n" + responce,
                            icon: "error", button: true,
                        });
                    }
                }
            });

       }

        function loadSearchedTable() {

            var searchtext = txtSearchName.value;

            var query ="&searchtext=";

            if(searchtext!="")
                query = "&searchtext=" + searchtext;
            //window.alert(query);
            loadTable(activepage, cmbPageSize.value, query);

        }

        function btnSearchMC(){
            activepage=1;
            loadSearchedTable();
        }

        function btnSearchClearMC(){
               loadView();
        }

       function btnPrintTableMC(productdesign) {

            var newwindow = window.open();
            formattab = tblProductdesigntype.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '> <h1>Product Design Type Details : </h1></div>" +
                "<div>"+ formattab+"</div>"+
               "</body>" +
                "</html>");
           setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
        }

        function closeviewmodule() {

            var update =  getUpdates()
            var errors = getErrors();
            if (errors == "" && update == "") {
                $('#formmodel').modal('hide')
                loadForm();
            }else
                swal({
                    title: "Do want to close the model...?",
                    icon: "warning", buttons: true, dangerMode: true,
                    className: "swal-button",
                }).then((willDelete) => {
                    if (willDelete) {
                        $('#formmodel').modal('hide')
                        loadForm();
                    }
                });
        }
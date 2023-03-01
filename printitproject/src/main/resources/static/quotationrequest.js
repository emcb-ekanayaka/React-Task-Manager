

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);

           // cmbsupplier.addEventListener("change",cmbsupplierCH);
            //cmbmaterial.addEventListener("change",cmbmaterialCH);
          /*  cmbsupplier.addEventListener("change",cmbMaterialrefreshtableCH);*/

            $('.js-example-basic-single').select2();
            txtSearchName.addEventListener("keyup",btnSearchMC);
           /* dtarequiredate.addEventListener("keyup",dtarequiredateMC);*/

            privilages = httpRequest("../privilage?module=QUOTATIONREQUEST","GET");
    
            suppliers = httpRequest("../supplier/list","GET");
            qrstatus = httpRequest("../qrstatus/list","GET");
            qremployee = httpRequest("../employee/list","GET");

            //inner form
            qrmaterials = httpRequest("../material/list","GET");

            valid = "2px solid green";
            invalid = "2px solid red";
            initial = "2px solid #d6d6c2";
            updated = "2px solid #ff9900";
            active = "#ff9900";

            loadView();
            loadForm();
        }

        function loadView() {

            //Search Area
            txtSearchName.value="";
            txtSearchName.style.background = "";

            //Table Area
            activerowno = "";
            activepage = 1;
            var query = "&searchtext=";
            loadTable(activepage,cmbPageSize.value,query);
        }

        function loadTable(page,size,query) {
            page = page - 1;
            quotationrequests = new Array();
          var data = httpRequest("/quotationrequest/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) quotationrequests = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblQuotation',quotationrequests,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblQuotation);

            if(activerowno!="")selectRow(tblQuotation,activerowno,active);

        }

        function paginate(page) {
            var paginate;
            if(oldquotationrequest==null){
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

        function viewitem(qr,rowno) {

            viewquotationrequest = JSON.parse(JSON.stringify(qr));


            tblquotationnumber.innerHTML = viewquotationrequest.qrno;
            tblsuppliername.innerHTML = viewquotationrequest.supplier_id.companyname;
            tblrequiredate.innerHTML = viewquotationrequest.requireddate;

            tblquotationstatus.innerHTML = viewquotationrequest.qrstatus_id.name;
            tbladdeddate.innerHTML = viewquotationrequest.addeddate;
            tblemployee.innerHTML = viewquotationrequest.employee_id.callingname;

            if (viewquotationrequest.description=!null){
                tbldescription.innerHTML = viewquotationrequest.description;
            }
            fillInnerTable("tblPrintInnerMaterial", viewquotationrequest.quotationRequestHasMaterialList, fillInnerForm, btnInnerDeleteMC, viewInnerMaterial)
            $('#Qrmodal').modal('show')


         }

        function btnprintrowMC() {

            var format = printformtable.outerHTML;

            var newwindow = window.open();
            newwindow.document.write("<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
                "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'></head>" +
                "<body><div style='margin-top: 150px'><h1>Quotation Request Details :</h1></div>" +
                "<div>" + format + "</div>" +
                "<script>printformtable.removeAttribute('style')</script>" +
                "</body></html>");
            setTimeout(function () {
                newwindow.print();
                newwindow.close();
            }, 100);

        }
        function dtarequiredateMC() {

            var pressdated = dtarequiredate.value;
            var datemin = new Date(dtarequiredate.min);
            var datemax = new Date(dtarequiredate.max);

            var pressdated1 = new Date(pressdated);
            var pressdated2 = pressdated1.getTime();
            var datemax = datemax.getTime();
            var datemin = datemin.getTime();

            console.log(pressdated2)
            console.log(datemin)
            console.log(datemax)

            var regpattern = new RegExp('^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$');
            if (regpattern.test(pressdated)) {
                if (pressdated2 <= datemax && pressdated2 >= datemin) {

                    console.log(1)
                    quotationrequest.requireddate = dtarequiredate.value;
                    dtarequiredate.style.border = valid;

                } else {
                    console.log(2)
                    dtarequiredate.value = "";
                    quotationrequest.requireddate = null;
                    dtarequiredate.style.border = invalid;
                }

            }
        }

        function loadForm() {
            quotationrequest = new Object();
            oldquotationrequest = null;

            quotationrequest.quotationRequestHasMaterialList = new Array();

            fillCombo(cmbsupplier,"Select Supplier",suppliers,"companyname","");
            fillCombo(cmbstatus,"Select Status",qrstatus,"name","Requested");
            fillCombo(cmbemployee,"Select Employee",qremployee,"callingname", session.getObject('activeuser').employeeId.callingname);
            quotationrequest.employee_id = JSON.parse(cmbemployee.value);
            quotationrequest.qrstatus_id = JSON.parse(cmbstatus.value);
            cmbemployee.disabled = true;
            cmbstatus.disabled = true;

            dtarequiredate.value = "";
            dtaaddeddate.value= getCurrentDateTime("date");
            quotationrequest.addeddate = dtaaddeddate.value;
            dtaaddeddate.disabled = true;
            dtaaddeddate.style.border = valid;

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/quotationrequest/nextnumber", "GET");
            txtqrn.value = nextNumber.qrno;
            quotationrequest.qrno = txtqrn.value;
            txtqrn.disabled="disabled";

            dtarequiredate.min = getCurrentDateTime("date");
            let today = new Date();
            let afteroneweek = new Date();
            afteroneweek.setDate(today.getDate()+7);
            let month = afteroneweek.getMonth()+1;
            if (month < 10) month = "0" +month; // [0-10]
            let day = afteroneweek.getDate(); // range (1-31)
            if (day < 10) day = "0"+day;
            dtarequiredate.max = afteroneweek.getFullYear()+"-"+month+"-"+day;

            txtdescription.value = "";
            cmbsupplier.value = "";
            cmbsupplier.disabled = false;
            dtarequiredate.disabled = false;

            setStyle(initial);
            cmbemployee.style.border=valid;
            cmbstatus.style.border=valid;
            dtaaddeddate.style.border=valid;
            txtqrn.style.border=valid;

            disableButtons(false, true, true);
            refreshInnerForm();

        }

        function refreshInnerForm() {

            quotationRequestHasMaterial = new Object();
            oldquotationRequestHasMaterial = null;

            $('#chkRequest').bootstrapToggle('off')

            $("#materialselect2parent .select2-container").css('border',initial);

            if(cmbsupplier.value !=""){
                cmbmaterial.disabled = false;
               // fillCombo(cmbmaterial, "Select Material", materialBysupplier, "materialname", "");
            }else {
                fillCombo(cmbmaterial, "Select Material", qrmaterials, "materialname", "");
                cmbmaterial.disabled = true;
            }
            /*quotationRequestHasMaterial.received = true;
            quotationRequestHasMaterial.requested = false;*/

            fillInnerTable("tblInnerMaterial", quotationrequest.quotationRequestHasMaterialList, fillInnerForm, btnInnerDeleteMC, false)
        }
        function cmbmaterialCH(){
            $('#chkRequest').bootstrapToggle('on')
        }

        function cmbsupplierCH(){

            materialBysupplier = httpRequest("/material/listByMaterial?supplierid=" + JSON.parse(cmbsupplier.value).id, "GET");
            fillCombo(cmbmaterial, "Select Material", materialBysupplier, "materialname", "");

            btnInnerClear.disabled = false;
            btnInnerAdd.disabled = false;
            cmbmaterial.disabled = false;
            quotationrequest.quotationRequestHasMaterialList = new Array();
            refreshInnerForm();

        }

        function checkinnerempty(){
            var error = "";

            if (quotationRequestHasMaterial.material_id == null){
                error = error + "\n" + "Select A Material...!";
                cmbmaterial.style.border = invalid;
            }
            return error;

        }


        function btnInnerAddMc() {
            console.log(quotationRequestHasMaterial);
            if(checkinnerempty() == ""){
                var matext = false;
                for (var index in quotationrequest.quotationRequestHasMaterialList) {
                    if (quotationrequest.quotationRequestHasMaterialList[index].material_id.materialname == quotationRequestHasMaterial.material_id.materialname) {
                        matext = true;
                        break;
                    }
                }
                if (matext) {
                    swal({
                        title: 'Already Excited..!', icon: "warning",
                        text: '\n',
                        button: false,
                        timer: 1200
                    });
                } else {
                    quotationrequest.quotationRequestHasMaterialList.push(quotationRequestHasMaterial);
                    refreshInnerForm();

                }
            }else{
                swal({
                    title: "You have following errors",
                    text: "\n"+checkinnerempty(),
                    icon: "error",
                    button: true,
                });

            }



        }

        function fillInnerForm() {
        }

        function btnInnerDeleteMC(innerob, innerrow) {

            swal({
                title: "Are you sure to Delete following material...?",

                text: "\nMaterial Name :" + innerob.material_id.materialname,
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        quotationrequest.quotationRequestHasMaterialList.splice(innerrow, 1)
                        refreshInnerForm();
                    }
                });

        }

        function viewInnerMaterial() {
        }



        function setStyle(style) {

            $("#supplierselect2parent .select2-container").css('border',style);
            dtarequiredate.style.border = style;
            txtdescription.style.border = style;
            cmbsupplier.style.border = style;
            cmbstatus.style.border = style;
            cmbemployee.style.border = style;
            dtaaddeddate.style.border = style;

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
            for(index in quotationrequests){
                if(quotationrequests[index].qrstatus_id.name =="Deleted"){
                    tblQuotation.children[1].children[index].style.color = "#f00";
                    tblQuotation.children[1].children[index].style.border = "2px solid red";
                    tblQuotation.children[1].children[index].lastChild.children[1].disabled = true;
                    tblQuotation.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }

        function nicTestFieldBinder(field,pattern,ob,prop,oldob) {
            var regpattern = new RegExp(pattern);

            var val = field.value.trim();
            if (regpattern.test(val)) {
                    var dobyear, gendername,noOfDays = "";
                    if (val.length===10){
                        dobyear = "19"+val.substring(0,2);
                        noOfDays = val.substring(2,5);
                    }else{
                         dobyear = val.substring(0,4);
                         noOfDays = val.substring(4,7);
                    }
                    birthdate = new Date(dobyear+"-"+"01-01");
                if (noOfDays>=1 && noOfDays<=366){
                    gendername =  "Male";
                }else if(noOfDays>=501 && noOfDays<=866){
                    noOfDays = noOfDays-500;
                    gendername =  "Female";
                }
                if(gendername=== "Female" ||  gendername ===  "Male"){
                    fillCombo(cmbGender,"Select Gender",genders,"name",gendername);
                    birthdate.setDate(birthdate.getDate()+parseInt(noOfDays)-1)
                    dteDOBirth.value = birthdate.getFullYear()+"-"+getmonthdate(birthdate);

                    employee.genderId = JSON.parse(cmbGender.value);
                    employee.dobirth = dteDOBirth.value;
                    employee.nic = field.value;
                    if (oldemployee != null && oldemployee.nic != employee.nic){
                        field.style.border=updated;}else {field.style.border=valid;}
                    if (oldemployee != null && oldemployee.dobirth != employee.dobirth){
                        dteDOBirth.style.border=updated;}else {dteDOBirth.style.border=valid;}
                    if (oldemployee != null && oldemployee.genderId.name != employee.genderId.name){
                        cmbGender.style.border=updated;}else {cmbGender.style.border=valid;}
                    dteDOBirthCH();
                }else{
                    field.style.border = invalid;
                    cmbGender.style.border = initial;
                    dteDOBirth.style.border = initial;
                    fillCombo(cmbGender,"Select Gender",genders,"name","");
                    dteDOBirth.value = "";
                        employee.nic = null;
                }
            }else{
                field.style.border = invalid;
                employee.nic = null;
            }

        }

        function nicFieldBinder(field,pattern,ob,prop,oldob) {
            var regpattern = new RegExp(pattern);

            var val = field.value.trim();
            if (regpattern.test(val)) {
                employee.nic = val;
                if (oldemployee != null && oldemployee.nic != employee.nic){
                    field.style.border = updated;
                    gender = generate(val,field,cmbGender,dteDOBirth);
                   fillCombo(cmbGender,"Select Gender",genders,"name",gender);
                   cmbGender.style.border=updated;
                    dteDOBirth.style.border=updated;
                    employee.genderId = JSON.parse(cmbGender.value);
                    employee.dobirth = dteDOBirth.value;
                }else{
                    field.style.border = valid;
                    gender =  generate(val,field,cmbGender,dteDOBirth);
                    fillCombo(cmbGender,"Select Gender",genders,"name",gender);
                    cmbGender.style.border=valid;
                    dteDOBirth.style.border=valid;
                    employee.genderId = JSON.parse(cmbGender.value);
                    employee.dobirth = dteDOBirth.value;
                }
            }
            else {
                field.style.border = invalid;
                employee.nic = null;
            }
        }

        function dteDOBirthCH() {
            var today = new Date();
            var birthday = new Date(dteDOBirth.value);
            if((today.getTime()-birthday.getTime())>(18*365*24*3600*1000)) {
                employee.dobirth = dteDOBirth.value;
                dteDOBirth.style.border = valid;
            }
            else
            {
                employee.dobirth = null;
                dteDOBirth.style.border = invalid;
            }
        }

        function getErrors() {

            var errors = "";
            addvalue = "";

            if (quotationrequest.qrno == null){
                errors = errors + "\n" + "Quotation Request Number Not Enter";
                txtqrn.style.border = invalid;
            }else  addvalue = 1;

            if (quotationrequest.supplier_id == null){
                errors = errors + "\n" + "Supplier Not Enter";
                cmbsupplier.style.border = invalid;
            }else  addvalue = 1;

            if (quotationrequest.requireddate == null){
                errors = errors + "\n" + "Require Date not Enter";
                dtarequiredate.style.border = invalid;
            }else  addvalue = 1;

            if (quotationrequest.addeddate == null){
                errors = errors + "\n" + "Added Date Not Selected";
                dtaaddeddate.style.border = invalid;
            }else  addvalue = 1;

            if (quotationrequest.qrstatus_id == null){
                errors = errors + "\n" + "Quotation Status Not Selected";
                cmbstatus.style.border = invalid;
            }else  addvalue = 1;

            if (quotationrequest.employee_id == null){
                errors = errors + "\n" + "Employee Not Selected";
                cmbemployee.style.border = invalid;
            }else  addvalue = 1;

            if (quotationrequest.quotationRequestHasMaterialList.length == 0){
                errors = errors + "\n" + "Material Not Selected";
                cmbmaterial.style.border = invalid;
            }else  addvalue = 1;

            return errors;

        }

        function btnAddMC(){
            if(getErrors()==""){
                if(txtdescription.value ==""){
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
                title: "Are you sure to add following Quotation Request...?" ,
                  text :  "\nQuotation Request Number : " + quotationrequest.qrno +
                    "\nRequired Date : " + quotationrequest.requireddate +
                    "\nSupplier Name : " + quotationrequest.supplier_id.companyname +
                    "\nAdded Date : " + quotationrequest.addeddate +
                    "\nQuotation Request Status : " + quotationrequest.qrstatus_id.name +
                    "\nEmployee : " + quotationrequest.employee_id.callingname,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/quotationrequest", "POST", quotationrequest);
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
                        loadSearchedTable();
                        loadForm();
                        $('#formmodel').modal('hide')
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

            if(oldemployee == null && addvalue == ""){
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

        function fillForm(qr,rowno){
            activerowno = rowno;

            if (oldquotationrequest==null) {
                filldata(qr);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(qr);
                    }

                });
            }

        }


        function filldata(qr) {
            clearSelection(tblQuotation);
            selectRow(tblQuotation,activerowno,active);

            quotationrequest = JSON.parse(JSON.stringify(qr));
            oldquotationrequest = JSON.parse(JSON.stringify(qr));

            txtqrn.value = quotationrequest.qrno;
            dtarequiredate.value = quotationrequest.requireddate;
            txtdescription.value = quotationrequest.description;
            dtaaddeddate.value = quotationrequest.addeddate;
            dtarequiredate.disabled = false;

            fillCombo(cmbsupplier, "Select Designation", suppliers, "companyname", quotationrequest.supplier_id.companyname);
            fillCombo(cmbstatus, "Select Civil Status", qrstatus, "name", quotationrequest.qrstatus_id.name);
            cmbstatus.disabled = false;
            fillCombo(cmbemployee, "", qremployee, "callingname", quotationrequest.employee_id.callingname);

            setStyle(valid);
            disableButtons(true, false, false);

            var currentdate = new Date(getCurrentDateTime('date'));
            var addeddate = new Date(dtaaddeddate.value);
            var requiredate = new Date(dtarequiredate.value);

            console.log("Current date",currentdate)
            console.log("Added date",addeddate)
            console.log("Require date",requiredate)

            var adddatemax = new Date(addeddate);
            adddatemax.setDate(addeddate.getDate()+7);
            console.log("Adddate max date",adddatemax)

            if (quotationrequest.qrstatus_id.name != "Received"){
                if (currentdate.getTime() > adddatemax.getTime()){
                    console.log(1)
                    dtarequiredate.value =  "";
                    dtarequiredate.style.border =  initial;

                    dtarequiredate.min = getCurrentDateTime("date");
                    let today = new Date();
                    let afteroneweek = new Date();
                    afteroneweek.setDate(today.getDate()+7);
                    let month = afteroneweek.getMonth()+1;
                    if (month < 10) month = "0" +month; // [0-10]
                    let day = afteroneweek.getDate(); // range (1-31)
                    if (day < 10) day = "0"+day;
                    dtarequiredate.max = afteroneweek.getFullYear()+"-"+month+"-"+day;

                }else if(currentdate.getTime() >= requiredate.getTime() && currentdate.getTime() <= adddatemax.getTime()){
                    console.log(2)
                    dtarequiredate.min = requiredate.getFullYear()+"-"+ getmonthdate(requiredate);
                    dtarequiredate.max = adddatemax.getFullYear()+"-"+ getmonthdate(adddatemax);

                }else if(currentdate.getTime() < requiredate.getTime() ){
                    console.log(3)
                  dtarequiredate.min = currentdate.getFullYear()+"-"+ getmonthdate(currentdate);
                  dtarequiredate.max = adddatemax.getFullYear()+"-"+ getmonthdate(adddatemax);
                }
            }

            if (oldquotationrequest != null){
                cmbsupplier.disabled = true;
            }
            if (oldquotationrequest!=null && quotationrequest.qrstatus_id.name == "Received"){
                dtarequiredate.disabled = true;
            }

            if (quotationrequest.description == null){
                txtdescription.style.border = initial;
            }
            refreshInnerForm();
            $('#formmodel').modal('show')

        }

        function getUpdates() {

            var updates = "";

            if(quotationrequest!=null && oldquotationrequest!=null) {

                if (quotationrequest.qrno != oldquotationrequest.qrno)
                    updates = updates + "\nQuotation Number is Changed.." + oldquotationrequest.qrno + " into " + quotationrequest.qrno;

                if (quotationrequest.requireddate != oldquotationrequest.requireddate)
                    updates = updates + "\nRequire Date is Changed.." + oldquotationrequest.requireddate + " into " + quotationrequest.requireddate;

                if (quotationrequest.description != oldquotationrequest.description)
                    updates = updates + "\nDescription is Changed.." + oldquotationrequest.description + " into " + quotationrequest.description;

                if (quotationrequest.supplier_id.companyname != oldquotationrequest.supplier_id.companyname)
                    updates = updates + "\nSupplier is Changed.." + oldquotationrequest.supplier_id.companyname + " into " + quotationrequest.supplier_id.companyname;

                if (quotationrequest.qrstatus_id.name != oldquotationrequest.qrstatus_id.name)
                    updates = updates + "\nQuotation Status is Changed.." + oldquotationrequest.qrstatus_id.name + " into " + quotationrequest.qrstatus_id.name;

                if (quotationrequest.employee_id.callingname != oldquotationrequest.employee_id.callingname)
                    updates = updates + "\nEmployee is Changed.." + oldquotationrequest.employee_id.callingname + " into " + quotationrequest.employee_id.callingname;

                if (quotationrequest.addeddate != oldquotationrequest.addeddate)
                    updates = updates + "\nAdded Date is Changed.." + oldquotationrequest.addeddate + " into " + quotationrequest.addeddate;

                if (isEqual(quotationrequest.quotationRequestHasMaterialList, oldquotationrequest.quotationRequestHasMaterialList , 'material_id'))
                    updates = updates + "\nMaterial is Changed..";
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
                        title: "Are you sure to update following Quotation Request details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/quotationrequest", "PUT", quotationrequest);
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
                                $('#formmodel').modal('hide');

                            }
                            else window.alert("Failed to Update as \n\n" + response);
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

        function btnDeleteMC(qr) {
            quotationrequest = JSON.parse(JSON.stringify(qr));

            swal({
                title: "Are you sure to delete following Quotation Request...?",
                text: "\n Quotation Number : " + quotationrequest.qrno +
                "\n Supplier Name : " + quotationrequest.supplier_id.companyname,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/quotationrequest","DELETE",quotationrequest);
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
            disableButtons(false, true, true);

        }

        function btnSearchClearMC(){
               loadView();
        }

       function btnPrintTableMC(qr) {

            var newwindow = window.open();
            formattab = tblQuotation.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
               "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'></head>" +
                "<body><div style='margin-top: 150px; '> <h1>Quotation Request Details : </h1></div>" +
                "<div>"+ formattab+"</div>"+
               "</body>" +
                "</html>");
           setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
        }

        function sortTable(cind) {
            cindex = cind;

         var cprop = tblEmployee.firstChild.firstChild.children[cindex].getAttribute('property');

           if(cprop.indexOf('.') == -1) {
               employees.sort(
                   function (a, b) {
                       if (a[cprop] < b[cprop]) {
                           return -1;
                       } else if (a[cprop] > b[cprop]) {
                           return 1;
                       } else {
                           return 0;
                       }
                   }
               );
           }else {
               employees.sort(
                   function (a, b) {
                       if (a[cprop.substring(0,cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.')+1)] < b[cprop.substring(0,cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.')+1)]) {
                           return -1;
                       } else if (a[cprop.substring(0,cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.')+1)] > b[cprop.substring(0,cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.')+1)]) {
                           return 1;
                       } else {
                           return 0;
                       }
                   }
               );
           }
            fillTable('tblEmployee',employees,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblEmployee);
            loadForm();

            if(activerowno!="")selectRow(tblEmployee,activerowno,active);


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
        function checkBoxBinder(){
            if (chkRequest.checked){
                quotationRequestHasMaterial.requested = true;
                quotationRequestHasMaterial.received  = false;

            }else{
                quotationRequestHasMaterial.received  = true;
                quotationRequestHasMaterial.requested = false;
            }
        }


 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {
            $('[data-toggle="tooltip"]').tooltip()


            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);

            cmbCatergory.addEventListener("change", cmbCatergoryCH);
            cmbsize.addEventListener("change", cmbsizeCH);
            cmbUnit.addEventListener("change", cmbUniteCH);
            cmbcolor.addEventListener("change", cmbcolorCH);

            txtSearchName.addEventListener("keyup",btnSearchMC);

            privilages = httpRequest("../privilage?module=MATERIAL","GET");

            materialcatergories = httpRequest("../materialcategory/list","GET");
            materialUnits = httpRequest("../materialunit/list","GET");
            materialStatus = httpRequest("../materialstatus/list","GET");
            employees = httpRequest("../employee/list","GET");
            colors = httpRequest("../color/list","GET");
            sizes = httpRequest("../size/list","GET");

            valid = "2px solid green";
            invalid = "2px solid red";
            initial = "2px solid #d6d6c2";
            updated = "2px solid #ff9900";
            active = "#ff9900";

            loadView();
            loadForm();
/*          changeTab('form');*/
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

        //Auto Load Table
        function loadTable(page,size,query) {
            page = page - 1;
            materials = new Array();
          var data = httpRequest("/material/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) materials = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblMaterial',materials,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblMaterial);

            if(activerowno!="")selectRow(tblMaterial,activerowno,active);

        }

        function paginate(page) {
            var paginate;
            if(oldmaterial == null){
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

        function viewitem(matt,rowno) {

            material = JSON.parse(JSON.stringify(matt));

            tblmaterialnumber.innerHTML = material.materialcode;
            tblmaterialcategory.innerHTML = material.materialcategory_id.name;
            tblmaterialname.innerHTML = material.materialname;
            tblunit.innerHTML = material.nopieces;
            tblunittype.innerHTML = material.unit_id.name;
            tblcolor.innerHTML = material.color_id.name;
            tblsize.innerHTML = material.size_id.name;
            tblrop.innerHTML = material.rop;
            tbldescription.innerHTML = material.description;
            tblmaterialstatus.innerHTML = material.materialstatus_id.name;
            tbldate.innerHTML = material.addeddate;
            tblemployee.innerHTML = material.employee_id.callingname;

            $('#materialmodal').modal('show')

         }

        function btnprintrowMC(){
            var format = printformtable.outerHTML;
            var newwindow = window.open();
            newwindow.document.write("<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px'><h1>Material Details :</h1></div>" +
                "<div>"+format+"</div>" +
                "<script>printformtable.removeAttribute('style')</script>" +
                "</body></html>");
            setTimeout(function () {
                newwindow.print();
                newwindow.close();
                },
                100);
        }

        function loadForm() {
            material = new Object();
            oldmaterial = null;

             fillCombo(cmbCatergory,"Select Material",materialcatergories,"name","");
             fillCombo(cmbUnit,"Select Type",materialUnits,"name","");
             fillCombo(cmbcolor,"Select Color",colors,"name","");
             fillCombo(cmbsize,"Select Size",sizes,"name","");

             fillCombo(cmbMaterialStatus,"Select Status",materialStatus,"name","Available");
            material.materialstatus_id = JSON.parse(cmbMaterialStatus.value);
            cmbMaterialStatus.disabled = true;

             fillCombo(cmbEmployee,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);
            material.employee_id = JSON.parse(cmbEmployee.value);
            cmbEmployee.disabled = true;


             var today = new Date(); // get current system date
             var month = today.getMonth()+1; //array [0-11]--MM
             if(month<10) month = "0"+month;
             var date = today.getDate();  // range 1-31 --DD
             if(date<10) date = "0"+date;

            cmbDate.value=today.getFullYear()+"-"+month+"-"+date;
            material.addeddate = cmbDate.value;
            cmbDate.disabled = true;

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/material/nextnumber", "GET");
            txtMaterial.value = nextNumber.materialcode;
            material.materialcode = txtMaterial.value;
            txtMaterial.disabled="disabled";
            txtMaterial.style.border = valid;

            txtMaterialName.value = "";
            txtPieces.value = "";
            txtRop.value = "";
            txtDescription.value = "";
            cmbcolor.value = "";
            cmbsize.value = "";

            cmbcolor.disabled = true;
            cmbsize.disabled = true;
            cmbUnit.disabled = true;
            txtMaterialName.disabled = true;

             setStyle(initial);
            cmbMaterialStatus.style.border=valid;
            cmbDate.style.border=valid;
            cmbEmployee.style.border=valid;

             disableButtons(false, true, true);

        }


        function cmbCatergoryCH(){
            unitchangebymaterialcatagory = httpRequest("unit/listbymaterial?materialid= "+ JSON.parse(cmbCatergory.value).id, "GET");
            fillCombo(cmbUnit,"Select Type",unitchangebymaterialcatagory,"name","");

            colorchangebymaterialcatagory = httpRequest("color/listbycolor?materialcategoryid= "+ JSON.parse(cmbCatergory.value).id, "GET");
            fillCombo(cmbcolor,"Select Color",colorchangebymaterialcatagory,"name","");

            sizechangebymaterialcatagory = httpRequest("size/listbysize?materialcategoryid= "+ JSON.parse(cmbCatergory.value).id, "GET");
            fillCombo(cmbsize,"Select Size",sizechangebymaterialcatagory,"name","");

            txtPieces.value = "";
            cmbUnit.value = "";
            txtMaterialName.value = "";
            cmbcolor.value = "";
            cmbsize.value = "";

            cmbcolor.disabled = false;
            cmbsize.disabled = false;
            cmbUnit.disabled = false;

            txtPieces.style.border = initial;
            cmbUnit.style.border = initial;
            txtMaterialName.style.border = initial;
            cmbcolor.style.border = initial;
            cmbsize.style.border = initial;

            material.nopieces = null;
            material.unit_id = null;
            material.materialname = null;
            material.size_id = null;
            material.color_id = null;
        }

        function cmbcolorCH(){
            if (material.materialcategory_id != null &&  material.size_id != null  &&  material.unit_id != null ){

            txtMaterialName.value = material.materialcategory_id.name +" "+ material.color_id.name +" "+ material.size_id.name;
            var mname = txtMaterialName.value;
            if (mname != "") {
                var response = httpRequest("material/bymterialname?materialname=" + mname, "GET")
                if (response == "") {

                        txtMaterialName.value = material.materialcategory_id.name +" "+ material.color_id.name+" "+ material.size_id.name;
                        material.materialname = txtMaterialName.value;
                        txtMaterialName.style.border = valid;

                        if (oldmaterial !=null &&  oldmaterial.materialname != material.materialname){
                            txtMaterialName.style.border = updated;
                        }else {
                            txtMaterialName.style.border = valid;
                        }

                } else {
                    swal({
                        title: "Material All Ready Exist....!",
                        text: "\n\n",
                        icon: "warning",
                        button: false,
                        timer: 1500
                    });
                    material.materialname = null;
                    txtMaterialName.value ="";
                    txtMaterialName.style.border = initial;
                }
            } else {

                if (txtMaterialName.required) {
                    txtMaterialName.style.border = invalid;
                } else {
                    txtMaterialName.style.border = initial;
                }
                material.materialname = null;
            }
            }
        }

        function cmbUniteCH(){

            if (material.materialcategory_id != null &&  material.size_id != null && material.color_id != null){

                txtMaterialName.value = material.materialcategory_id.name +" "+ material.color_id.name +" "+ material.size_id.name;
                var mname = txtMaterialName.value;
                if (mname != "") {
                    var response = httpRequest("material/bymterialname?materialname=" + mname, "GET")
                    if (response == "") {

                        txtMaterialName.value = material.materialcategory_id.name +" "+ material.color_id.name +" "+ material.size_id.name;
                        material.materialname = txtMaterialName.value;
                        txtMaterialName.style.border = valid;

                        if (oldmaterial !=null &&  oldmaterial.materialname != material.materialname){
                            txtMaterialName.style.border = updated;
                        }else {
                            txtMaterialName.style.border = valid;
                        }

                    } else {
                        swal({
                            title: "Material All Ready Exist....!",
                            text: "\n\n",
                            icon: "warning",
                            button: false,
                            timer: 1500
                        });
                        material.materialname = null;
                        txtMaterialName.value ="";
                        txtMaterialName.style.border = initial;
                    }
                } else {

                    if (txtMaterialName.required) {
                        txtMaterialName.style.border = invalid;
                    } else {
                        txtMaterialName.style.border = initial;
                    }
                    material.materialname = null;
                }

            }


        }

        function cmbsizeCH(){

            if (material.materialcategory_id != null &&  material.unit_id != null && material.color_id != null){

            txtMaterialName.value = material.materialcategory_id.name +" "+ material.color_id.name +" "+ material.size_id.name;
            var mname = txtMaterialName.value;
            if (mname != "") {
                    var response = httpRequest("material/bymterialname?materialname=" + mname, "GET")
                    if (response == "") {
                            txtMaterialName.value = material.materialcategory_id.name +" "+ material.color_id.name +" "+ material.size_id.name;
                            material.materialname = txtMaterialName.value;
                            txtMaterialName.style.border = valid;

                            if (oldmaterial !=null &&  oldmaterial.materialname != material.materialname){
                                txtMaterialName.style.border = updated;
                            }else {
                                txtMaterialName.style.border = valid;
                            }

                    } else {
                        swal({
                            title: "Material All Ready Exist....!",
                            text: "\n\n",
                            icon: "warning",
                            button: false,
                            timer: 1500
                        });
                        material.materialname = null;
                        txtMaterialName.value ="";
                        txtMaterialName.style.border = initial;
                    }
            } else {

                if (txtMaterialName.required) {
                    txtMaterialName.style.border = invalid;
                } else {
                    txtMaterialName.style.border = initial;
                }
                material.materialname = null;
            }
            }
        }

        function setStyle(style) {

            txtMaterialName.style.border = style;
            txtPieces.style.border = style;
            txtRop.style.border = style;
            txtDescription.style.border = style;
            cmbcolor.style.border = style;
            cmbsize.style.border = style;

            cmbCatergory.style.border = style;
            cmbUnit.style.border = style;
            cmbMaterialStatus.style.border = style;
            cmbDate.style.border = style;


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
            for(index in materials){
                if(materials[index].materialstatus_id.name =="Deleted"){
                    tblMaterial.children[1].children[index].style.color = "#f00";
                    tblMaterial.children[1].children[index].style.border = "2px solid red";
                    tblMaterial.children[1].children[index].lastChild.children[1].disabled = true;
                    tblMaterial.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

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

            if (material.materialcode == null){
                txtMaterial.style.border = invalid;
                errors = errors + "\n" + "Material Code Not Enter";
            }
            else  addvalue = 1;

            if (material.nopieces == null){
                txtPieces.style.border = invalid;
                errors = errors + "\n" + "Number Of Pieces not Enter";
            }
            else  addvalue = 1;

            if (material.materialname == null){
                txtMaterialName.style.border = invalid;
                errors = errors + "\n" + "Material Name Not Enter";
            }
            else  addvalue = 1;

            if (material.addeddate == null){
                cmbDate.style.border = invalid;
                errors = errors + "\n" + "Date Not Selected";
            }
            else  addvalue = 1;

            if (material.materialcategory_id == null){
                cmbCatergory.style.border = invalid;
                errors = errors + "\n" + "Material Category Not Selected";
            }
            else  addvalue = 1;

            if (material.unit_id == null){
                cmbUnit.style.border = invalid;
                errors = errors + "\n" + "Unit Not Selected";
            }
            else  addvalue = 1;

            if (material.materialstatus_id == null){
                cmbMaterialStatus.style.border = invalid;
                errors = errors + "\n" + "material Status Not Selected";
            }
            else  addvalue = 1;

            if (material.employee_id == null){
                cmbEmployee.style.border = invalid;
                errors = errors + "\n" + "Employee Not Selected";
            }
            else  addvalue = 1;
            return errors;

        }

        function btnAddMC(){
            if(getErrors()==""){
                if(txtRop.value=="" || txtDescription.value ==""){
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
                title: "Are you sure to add following Material...?" ,
                  text :  "\nMaterial Code : " + material.materialcode +
                    "\nMaterial Category : " + material.materialcategory_id.name +
                    "\nMaterial Name : " + material.materialname +
                    "\nColor: " + material.color_id.name +
                      "\nSize: " + material.size_id.name +
                    "\nUnit : " + material.unit_id.name +
                    "\nMaterial Status : " + material.materialstatus_id.name +
                    "\nDate : " + material.addeddate +
                    "\nAdded By : " + material.employee_id.callingname,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/material", "POST", material);
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

            if(oldmaterial == null && addvalue == ""){
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

        function fillForm(matt,rowno){
            activerowno = rowno;

            if (oldmaterial==null) {
                filldata(matt);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(matt);
                    }

                });
            }

        }


        function filldata(matt) {
            clearSelection(tblMaterial);
            selectRow(tblMaterial,activerowno,active);

            material = JSON.parse(JSON.stringify(matt));
            oldmaterial = JSON.parse(JSON.stringify(matt));

            txtMaterial.value = material.materialcode;
            txtMaterialName.value = material.materialname;
            txtPieces.value = material.nopieces;
            txtRop.value = material.rop;
            txtDescription.value = material.description;
            cmbDate.value = material.addeddate;

            fillCombo(cmbCatergory, "Select Category", materialcatergories, "name", material.materialcategory_id.name);
            fillCombo(cmbUnit, "Select Unit", materialUnits, "name", material.unit_id.name);
            fillCombo(cmbMaterialStatus, "Select Material Status", materialStatus, "name", material.materialstatus_id.name);
            cmbMaterialStatus.disabled = false;

            fillCombo(cmbEmployee, "", employees, "callingname", material.employee_id.callingname);

            disableButtons(true, false, false);
            setStyle(valid);

            $('#formmodel').modal('show')

            if (material.description == null){
                txtDescription.style.border =initial;
            }

            if (material.rop == null){
                txtRop.style.border =initial;
            }
        }

        function getUpdates() {

            var updates = "";

            if(material!=null && oldmaterial!=null) {

                if (material.materialcode != oldmaterial.materialcode)
                    updates = updates + "\nMaterial Code is Changed.." + oldmaterial.materialcode + " into " + material.materialcode ;

                if (material.materialcategory_id.name != oldmaterial.materialcategory_id.name)
                    updates = updates + "\nMaterial Category is Changed.." + oldmaterial.materialcategory_id.name + " into " + material.materialcategory_id.name ;

                if (material.materialname != oldmaterial.materialname)
                    updates = updates + "\nMaterial Name is Changed.." + oldmaterial.materialname + " into " + material.materialname ;

                if (material.nopieces != oldmaterial.nopieces)
                    updates = updates + "\nNumber of Pieces is Changed.." + oldmaterial.nopieces + " into " + material.nopieces ;

                if (material.unit_id.name != oldmaterial.unit_id.name)
                    updates = updates + "\nUnit is Changed.." + oldmaterial.unit_id.name + " into " + material.unit_id.name ;

                if (material.rop != oldmaterial.rop)
                    updates = updates + "\nRop is Changed.." + oldmaterial.rop + " into " + material.rop ;

                if (material.description != oldmaterial.description)
                    updates = updates + "\nDescription is Changed.." + oldmaterial.description + " into " + material.description ;

                if (material.materialstatus_id.name != oldmaterial.materialstatus_id.name)
                    updates = updates + "\nmaterial Status is Changed.." + oldmaterial.materialstatus_id.name + " into " + material.materialstatus_id.name ;

                if (material.addeddate != oldmaterial.addeddate)
                    updates = updates + "\nAdded Date is Changed.." + oldmaterial.addeddate + " into " + material.addeddate ;

                if (material.employee_id.callingname != oldmaterial.employee_id.callingname)
                    updates = updates + "\nMobile Number is Changed.." + oldmaterial.employee_id.callingname + " into " + material.employee_id.callingname;

                if (material.employee_id.callingname != oldmaterial.employee_id.callingname)
                    updates = updates + "\nMobile Number is Changed.." + oldmaterial.employee_id.callingname + " into " + material.employee_id.callingname;

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
                        title: "Are you sure to update following Material details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/material", "PUT", material);
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

                            }else

                            swal({
                                title: 'Nothing Updated..!',icon: "warning",
                                text: '\n Failed to Update as ' +response,
                                button: false,
                                });
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

        function btnDeleteMC(matt) {
            material = JSON.parse(JSON.stringify(matt));

            swal({
                title: "Are you sure to delete following material...?",
                text: "\n Material Code : " + material.materialcode +
                "\n Material Name : " + material.materialname,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/material","DELETE",material);
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
            disableButtons(false, true, true);

        }

        function btnSearchMC(){
            activepage=1;
            loadSearchedTable();
        }

        function btnSearchClearMC(){
               loadView();
        }

       function btnPrintTableMC(material) {

            var newwindow = window.open();
            formattab = tblMaterial.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '> <h1>Material Details : </h1></div>" +
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
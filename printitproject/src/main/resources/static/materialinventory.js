

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            txtSearchName.addEventListener("keyup",btnSearchMC);

           /* btnAdd.addEventListener("click", btnAddMC);
            btnClear.addEventListener("click", btnClearMC);
            btnUpdate.addEventListener("click", btnUpdateMC);*/

            privilages = httpRequest("../privilage?module=MATERIALINVENTORY","GET");

        /*    materialcatergories = httpRequest("../materialcategory/list","GET");
            materialUnits = httpRequest("../materialunit/list","GET");
            materialStatus = httpRequest("../materialstatus/list","GET");
            employees = httpRequest("../employee/list","GET");*/

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
            materialinventries = new Array();
          var data = httpRequest("/materialinventory/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) materialinventries = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblMaterialInventory',materialinventries,false,false,viewitem);
            clearSelection(tblMaterialInventory);

            if(activerowno!="")selectRow(tblMaterialInventory,activerowno,active);

        }

        function paginate(page) {
            var paginate = true;
            if(paginate) {
                activepage=page;
                activerowno=""
                loadForm();
                loadSearchedTable();
            }

        }

      function viewitem(matt,rowno) {

            materialinventory = JSON.parse(JSON.stringify(matt));


          tblavailableqty.innerHTML = materialinventory.avaqty;
          tbltotalqty.innerHTML = materialinventory.totalqty;
          tblmaterialname.innerHTML = materialinventory.material_id.materialname;
          tblinventorystatus.innerHTML = materialinventory.inventorystatus_id.name;

            $('#viewmodal').modal('show')

         }

        function btnprintrowMC(){
            var format = printformtable.outerHTML;
            var newwindow = window.open();
            newwindow.document.write("<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px'><h1>Material Inventory Details :</h1></div>" +
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

          disableButtons();


        }

    /*    function setStyle(style) {

            txtMaterialName.style.border = style;
            txtPieces.style.border = style;
            txtRop.style.border = style;
            txtDescription.style.border = style;

            cmbCatergory.style.border = style;
            cmbUnit.style.border = style;
            cmbMaterialStatus.style.border = style;
            cmbDate.style.border = style;


        }*/

        function disableButtons() {


            //
            for(index in materialinventries){

                tblMaterialInventory.children[1].children[index].lastChild.children[0].style.display = "none";
                tblMaterialInventory.children[1].children[index].lastChild.children[1].style.display = "none";

                //to set inventory status color to view low inventory
                if(materialinventries[index].inventorystatus_id.name =="Deleted"){
                    tblMaterialInventory.children[1].children[index].style.color = "#f00";
                    tblMaterialInventory.children[1].children[index].style.border = "2px solid red";


                }
            }

        }

     /*   function getErrors() {

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

        }*/

 /*       function btnAddMC(){
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
        }*/
        
   /*     function savedata() {

            swal({
                title: "Are you sure to add following Material...?" ,
                  text :  "\nMaterial Code : " + material.materialcode +
                    "\nMaterial Category : " + material.materialcategory_id.name +
                    "\nMaterial Name : " + material.materialname +
                    "\nNumber of Pieces : " + material.nopieces +
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

        }*/

      /*  function btnClearMC() {
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

        }*/

        /*function fillForm(matt,rowno){
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

        }*/


    /*    function filldata(matt) {
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
        }*/

   /*     function getUpdates() {

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

        }*/

     /*   function btnUpdateMC() {
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

        }*/

        function btnDeleteMC(matt) {
            materialinventory = JSON.parse(JSON.stringify(matt));

            swal({
                title: "Are you sure to delete following material inventory...?",
                text: "\n ",
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/materialinventory","DELETE",materialinventory);
                    if (responce==0) {
                        swal({
                            title: "Deleted Successfully....!",
                            text: "\n\n  Status change to delete",
                            icon: "success", button: false, timer: 1200,
                        });
                        loadSearchedTable();
                        disableButtons(false, true, true);
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
                "<body><div style='margin-top: 150px; '> <h1>Material Inventory Details : </h1></div>" +
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
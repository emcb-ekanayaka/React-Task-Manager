package com.printit.controller;

import com.printit.model.*;
import com.printit.repository.*;
import com.printit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController //To set the class readable
@RequestMapping(value = "/supplierpayment")
public class SupplierPaymentController {

    @Autowired // to get a instance
    private UserService userService;

    @Autowired // to get a instance
    private PrevilageController previlageController;

    @Autowired // to get a instance
    private SupplierPaymentRepository dao;

   @Autowired //To create a Instence for this
    private SupplierpaymentStatusRepository daosatus;

    @Autowired //To create a Instence for this
    private SupplierRepository daosupplier;

    @Autowired //To create a Instence for this
    private GrnRepository daogrn;

    @Autowired //To create a Instence for this
    private GrnStatusRepository daogrnstatus;

    @Autowired //To create a Instence for this
    private PorderRepository daoporder;

    @Autowired //To create a Instence for this
    private PorderStatusRepository daoporderstatus;



 /*   //Get Request For QR Supplier list
    @GetMapping(value = "/list" , produces = "application/Json")
    public List<Supplier> supplierList(){
        return dao.list();
    }*/

    @GetMapping(value = "/nextnumber" , produces = "application/Json")
    public Supplierpayment nextNumber(){
        String nextNumber = dao.getNextNumber();
        Supplierpayment nextSupplierpayment = new Supplierpayment(nextNumber);
        return nextSupplierpayment;
    }

    //Get Request Mapping For Get Supplier page Request given Params
    @GetMapping(value = "/findAll" , params ={"page", "size"}, produces = "application/Json") //values type will return as a json object.
    public Page<Supplierpayment> findAll(@RequestParam("page") int page , @RequestParam("size") int size){


        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"SUPPLIERPAYMENT");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

    //Get Request Mapping For Get Supplier page Request given Params with Search Value
    @GetMapping(value = "/findAll" , params ={"page", "size","searchtext"}, produces = "application/Json") //values type will return as a json object.
    public Page<Supplierpayment> findAll(@RequestParam("page") int page , @RequestParam("size") int size , @RequestParam("searchtext") String searchtext){
        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"SUPPLIERPAYMENT");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }

    //post mapping for insert Quotation object
    @PostMapping
    public String insert(@RequestBody Supplierpayment supplierpayment) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUPPLIERPAYMENT");

        //check user null
        if (user != null && priv != null && priv.get("add")) {
            try {
                Supplier balanceamountofsupplier = daosupplier.getById(supplierpayment.getSupplier_id().getId());
                balanceamountofsupplier.setArrestamount(supplierpayment.getBalanceamount());

                for (SupplierHasMaterial shm : balanceamountofsupplier.getSupplierHasMaterials()){
                    shm.setSupplier_id(balanceamountofsupplier);
                }

                if (supplierpayment.getGrn_id() != null){
                    Grn grn = daogrn.getById(supplierpayment.getGrn_id().getId());
                    grn.setGrnstatus_id(daogrnstatus.getById(2));

                    for (GrnHasMaterial gr : grn.getGrnHasMaterialList())
                        gr.setGrn_id(grn);

                    Purchaseorder pdr = daoporder.getById(grn.getPorder_id().getId());
                    pdr.setPorderstatus_id(daoporderstatus.getById(5));

                    for (PorderHasMaterial req : pdr.getPorderHasMaterialList())
                        req.setPorder_id(pdr);

                    daoporder.save(pdr);
                    daogrn.save(grn);
                }

                daosupplier.save(balanceamountofsupplier);
                dao.save(supplierpayment);
                return "0";
            } catch (Exception ex) {
                return "Add not completed " + ex.getMessage();
            }
        } else
            return "error add..! You Have No Privilage...";
    }

  //put mapping for insert Supplier object
    @PutMapping
    public String update(@RequestBody Supplierpayment supplierpayment) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUPPLIERPAYMENT");

        //check user null
        if (user != null && priv != null && priv.get("update")) {
            try {
                Supplier balanceamountofsupplier = daosupplier.getById(supplierpayment.getSupplier_id().getId());
                balanceamountofsupplier.setArrestamount(supplierpayment.getBalanceamount());

                for (SupplierHasMaterial shm : balanceamountofsupplier.getSupplierHasMaterials()){
                    shm.setSupplier_id(balanceamountofsupplier);
                }
                daosupplier.save(balanceamountofsupplier);
                dao.save(supplierpayment);
                return "0";
            } catch (Exception ex) {
                return "Update not completed " + ex.getMessage();
            }
        } else
            return "error update..! You Have No Privilage...";
    }

    //Delete mapping for Supplier object
     @DeleteMapping
    public String delete(@RequestBody Supplierpayment supplierpayment){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUPPLIERPAYMENT");

        //check user null
        if (user != null && priv != null && priv.get("delete")) {
            try{
                supplierpayment.setSpaystatus_id(daosatus.getById(3));

                dao.save(supplierpayment);
                return "0";
            }catch (Exception ex){
                return "Delete not completed "+ex.getMessage();
            }
        } else
            return "error deleting..! You Have No Privilage...";
    }
}

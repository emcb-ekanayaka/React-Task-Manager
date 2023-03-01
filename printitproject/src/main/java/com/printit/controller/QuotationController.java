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
import java.util.List;


@RestController //To set the class readable
@RequestMapping(value = "/quotation")
public class QuotationController {

    @Autowired //To create a Instence for this
    private QuotationRepository dao;

    @Autowired //To create a Instence for this
    private QuotationRequestRepository quotationrequestdao;

    @Autowired //To create a Instence for this
    private QuotationRequestHasMaterialRepository quatationreqhasmatedao;

    @Autowired //To create a Instence for this
    private QuotationRequestStatusRepository quotationrequestStatus;

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

  @Autowired //To create a Instence for this
    private QuotationStatusRepository daosatus;

    @Autowired //To create a Instence for this
    private MaterialRepository daoMaterial;

  @GetMapping(value = "/listbyquotation" ,params = {"supplierid"}, produces = "application/Json")
  public List<Quotation>quotationList(@RequestParam("supplierid") Integer supplierid ){
      return dao.quotationList(supplierid);
  }

    //Get Request For Supplier list
    @GetMapping(value = "/list" , produces = "application/Json")
    public List<Quotation> supplierList(){
        return dao.list();
    }

    @GetMapping(value = "/nextNumber" , produces = "application/Json")
    public Quotation nextNumber(){
        String nxtQuotation = dao.getNextNumber();
        Quotation nextQuotation = new Quotation(nxtQuotation);
        return nextQuotation;
    }

    //Get Request Mapping For Get Material page Request given Params
    @GetMapping(value = "/findAll" , params ={"page", "size"}, produces = "application/Json") //values type will return as a json object.
    public Page<Quotation> findAll(@RequestParam("page") int page , @RequestParam("size") int size){


        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"QUOTATION");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }


//    Get Request Mapping For Get Material page Request given Params with Search Value
    @GetMapping(value = "/findAll" , params ={"page", "size","searchtext"}, produces = "application/Json") //values type will return as a json object.
    public Page<Quotation> findAll(@RequestParam("page") int page , @RequestParam("size") int size , @RequestParam("searchtext") String searchtext){
        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"QUOTATION");

        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }


  // post mapping for insert Quotation object
    @PostMapping
    public String insert(@RequestBody Quotation quotation) {

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATION");

        //check user null
        if (user != null && priv != null && priv.get("add")) {
            try {

                for (QuotationHasMaterial quo : quotation.getQuotationHasMaterialList())
                    quo.setQuotation_id(quotation);

                dao.save(quotation);

                // change status of of quotation request
                Quotationrequest qrquotation = quotationrequestdao.getById(quotation.getQuotationrequest_id().getId());
                qrquotation.setQrstatus_id(quotationrequestStatus.getById(2));
                for (QuotationRequestHasMaterial qur : qrquotation.getQuotationRequestHasMaterialList())
                    qur.setQuotationrequest_id(qrquotation);

                quotationrequestdao.save(qrquotation);

                // change status of not received to received in quotation request has material inner form
                for (QuotationHasMaterial quo : quotation.getQuotationHasMaterialList()){
                    QuotationRequestHasMaterial qRHMaterial = quatationreqhasmatedao.getbyquotationRequest(quo.getMaterial_id().getId(),qrquotation.getId());
                    qRHMaterial.setReceived(true);
                    qRHMaterial.setQuotationrequest_id(qrquotation);
                    quatationreqhasmatedao.save(qRHMaterial);

                }
                for (QuotationHasMaterial quo : quotation.getQuotationHasMaterialList()){
                    Material exemate = daoMaterial.getById(quo.getMaterial_id().getId());
                    if (exemate != null){
                        // if first one is greater than second one
                        if((quo.getPurchaseprice().compareTo(exemate.getPurchaseprice()))==1){
                            exemate.setPurchaseprice(quo.getPurchaseprice());
                        }
                    }
                    daoMaterial.save(exemate);
                }

                return "0";
            } catch (Exception ex) {
                return "Add not completed " + ex.getMessage();
            }
        } else
            return "error add..! You Have No Privilage...";
    }

    //post mapping for Quotation object
    @PutMapping
    public String update(@RequestBody Quotation quotation){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATION");

        //check user null
        if (user != null && priv != null && priv.get("update")) {
            try{

                for (QuotationHasMaterial quo : quotation.getQuotationHasMaterialList())
                    quo.setQuotation_id(quotation);

                dao.save(quotation);

                // change status of of quotation request
                Quotationrequest qrquotation = quotationrequestdao.getById(quotation.getQuotationrequest_id().getId());
                qrquotation.setQrstatus_id(quotationrequestStatus.getById(2));
                for (QuotationRequestHasMaterial qur : qrquotation.getQuotationRequestHasMaterialList())
                    qur.setQuotationrequest_id(qrquotation);

                quotationrequestdao.save(qrquotation);

                // change status of not received to received in quotation request has material inner form
                for (QuotationHasMaterial quo : quotation.getQuotationHasMaterialList()){
                    QuotationRequestHasMaterial qRHMaterial = quatationreqhasmatedao.getbyquotationRequest(quo.getMaterial_id().getId(),qrquotation.getId());
                    qRHMaterial.setReceived(true);
                    qRHMaterial.setQuotationrequest_id(qrquotation);
                    quatationreqhasmatedao.save(qRHMaterial);

                }
                for (QuotationHasMaterial quo : quotation.getQuotationHasMaterialList()){
                    Material exemate = daoMaterial.getById(quo.getMaterial_id().getId());
                    if (exemate != null){
                        exemate.setPurchaseprice(quo.getPurchaseprice());
                    }
                    daoMaterial.save(exemate);
                }
                return "0";
            }catch (Exception ex){
                return "Update not completed "+ex.getMessage();
            }
        } else
            return "error update..! You Have No Privilage...";
    }

  // Delete mapping for Quotation object
    @DeleteMapping
    public String delete(@RequestBody Quotation quotation){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATION");

        //check user null
        if (user != null && priv != null && priv.get("delete")) {
            try{
                quotation.setQuotationstatus_id(daosatus.getById(3));

                for (QuotationHasMaterial req : quotation.getQuotationHasMaterialList())
                    req.setQuotation_id(quotation);

                dao.save(quotation);
                return "0";
            }catch (Exception ex){
                return "Delete not completed "+ex.getMessage();
            }
        } else
            return "error deleting..! You Have No Privilage...";
    }


}

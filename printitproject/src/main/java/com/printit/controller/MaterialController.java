package com.printit.controller;
import com.printit.model.Material;
import com.printit.model.User;
import com.printit.repository.MaterialRepository;
import com.printit.repository.MaterialStatusRepository;
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
@RequestMapping(value = "/material")
public class MaterialController {

    @Autowired //To create a Instence for this
    private MaterialRepository dao;

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired //To create a Instence for this
    private MaterialStatusRepository daosatus;

    //service in controller
    @GetMapping(value = "/bymterialname",params = "materialname",produces = "application/json")
    public Material materialBymaterialname(@RequestParam("materialname") String materialname){
        return dao.findBymaterialname(materialname);
    }
    @GetMapping(value = "/nextnumber" , produces = "application/Json")
    public Material nextNumber(){
        String nextNumber = dao.getNextNumber();
        Material nextMaterial = new Material(nextNumber);
        return nextMaterial;
    }
    //Get Mapping For Get Material By given Quotation Id
    @GetMapping(value = "/listByMaterial", params ={"porderid"}, produces = "application/Json")
    public List<Material> materialListByporder(@RequestParam("porderid") int porderid){
        return dao.matirialListByporder(porderid);
    }
    //Get Mapping For Get Material By given Quotation Id
    @GetMapping(value = "/listByMaterial", params ={"quotationid"}, produces = "application/Json")
    public List<Material> materialListByquotation(@RequestParam("quotationid") int quotationid){
        return dao.matirialListByQuotation(quotationid);
    }
    //Get Mapping For Get Material By given Quotationrequest Id
    @GetMapping(value = "/listByMaterial", params ={"quotationrequestid"}, produces = "application/Json")
    public List<Material> materialListByquotationRequest(@RequestParam("quotationrequestid") int quotationrequestid){
        return dao.Listbymaterial(quotationrequestid);
    }
    //Get Mapping For Get Material By given Supplier Id
    @GetMapping(value = "/listByMaterial", params ={"supplierid"}, produces = "application/Json")
    public List<Material> materialListBySupplier(@RequestParam("supplierid") int supplierid){
        return dao.matirialListBySupplier(supplierid);
    }
    //Get Request For Supplier Material list
    @GetMapping(value = "/list" , produces = "application/Json")
    public List<Material> materialList(){
        return dao.list();
    }

    //Get Request Mapping For Get Material page Request given Params
    @GetMapping(value = "/findAll" , params ={"page", "size"}, produces = "application/Json")
    //values type will return as a json object.
    public Page<Material> findAll(@RequestParam("page") int page , @RequestParam("size") int size){
        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"MATERIAL");
        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }
    //Get Request Mapping For Get Material page Request given Params with Search Value
    //values type will return as a json object.
    @GetMapping(value = "/findAll" , params ={"page", "size","searchtext"}, produces = "application/Json")
    public Page<Material> findAll(@RequestParam("page") int page ,
                                  @RequestParam("size") int size ,@RequestParam("searchtext") String searchtext){
        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get User Modual Privilage
        HashMap<String,Boolean> priv = previlageController.getPrivilages(user,"MATERIAL");
        //check user null
        if(user!= null && priv != null && priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else
            return null;
    }
    //post mapping for insert material object
    @PostMapping
    public String insert(@RequestBody Material material) {
        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "MATERIAL");
        //check user null
        if (user != null && priv != null && priv.get("add")) {
            try {
                dao.save(material);
                return "0";
            } catch (Exception ex) {
                return "Add not completed " + ex.getMessage();
            }
        } else
            return "error add..! You Have No Privilage...";
    }

    //post mapping for Material object
    @PutMapping
    public String update(@RequestBody Material material){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "MATERIAL");

        //check user null
        if (user != null && priv != null && priv.get("update")) {
            try{
                dao.save(material);
                return "0";
            }catch (Exception ex){
                return "Update not completed "+ex.getMessage();
            }
        } else
            return "error update..! You Have No Privilage...";
    }

    //Delete mapping for Material object
    @DeleteMapping
    public String delete(@RequestBody Material material){

        //get security contaxt authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        //get user from DB
        User user = userService.findUserByUserName(auth.getName());

        //get User Modual Privilage
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "MATERIAL");

        //check user null
        if (user != null && priv != null && priv.get("delete")) {
            try{
                material.setMaterialstatus_id(daosatus.getById(3));
                dao.save(material);
                return "0";
            }catch (Exception ex){
                return "Delete not completed "+ex.getMessage();
            }
        } else
            return "error deleting..! You Have No Privilage...";
    }

}

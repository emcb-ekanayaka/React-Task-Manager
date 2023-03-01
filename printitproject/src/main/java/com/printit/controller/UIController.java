package com.printit.controller;

import com.printit.model.User;
import com.printit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController //To set the class readable
public class UIController {

    @Autowired  // to get a instance
    private UserService userService;

    @RequestMapping(value = "/access-denied", method = RequestMethod.GET)
    public ModelAndView error(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("error.html");
        return modelAndView;
    }

    @RequestMapping(value = "/config", method = RequestMethod.GET)
    public ModelAndView config(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("config.html");
        return modelAndView;
    }

    @GetMapping(value = {"/employee" })
    public ModelAndView employeeui() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("employee.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(path = "/employee/{id}")
    public ModelAndView employeessui() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("employee.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(value = "/privilage")
    public ModelAndView privilageui() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("privilage.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }




    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public ModelAndView user() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("user.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }


    @RequestMapping(value = "/customer", method = RequestMethod.GET)
    public ModelAndView customerUi() {
        //Create Modal And View Object
        ModelAndView modelAndView = new ModelAndView();
        //Get Securety Contex Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Get User From DB
        User user = userService.findUserByUserName(auth.getName());
        //Check User Null
        if(user!= null){
            modelAndView.setViewName("customer.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/productdesigntype", method = RequestMethod.GET)
    public ModelAndView productdesigntypeUi() {
        //Create Modal And View Object
        ModelAndView modelAndView = new ModelAndView();
        //Get Securety Contex Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Get User From DB
        User user = userService.findUserByUserName(auth.getName());
        //Check User Null
        if(user!= null){
            modelAndView.setViewName("productdesigntype.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/material", method = RequestMethod.GET)
    public ModelAndView materialUi() {
        //Create Modal And View Object
        ModelAndView modelAndView = new ModelAndView();
        //Get Securety Contex Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Get User From DB
        User user = userService.findUserByUserName(auth.getName());
        //Check User Null
        if(user!= null){
            modelAndView.setViewName("material.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }


    @RequestMapping(value = "/supplier", method = RequestMethod.GET)
    public ModelAndView supplierUi() {
        //Create Modal And View Object
        ModelAndView modelAndView = new ModelAndView();
        //Get Securety Contex Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Get User From DB
        User user = userService.findUserByUserName(auth.getName());
        //Check User Null
        if(user!= null){
            modelAndView.setViewName("supplier.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/quotationrequest", method = RequestMethod.GET)
    public ModelAndView quotationrequestUi() {
        //Create Modal And View Object
        ModelAndView modelAndView = new ModelAndView();
        //Get Securety Contex Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Get User From DB
        User user = userService.findUserByUserName(auth.getName());
        //Check User Null
        if(user!= null){
            modelAndView.setViewName("quotationrequest.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }


    @RequestMapping(value = "/quotation", method = RequestMethod.GET)
    public ModelAndView quotationUi() {
        //Create Modal And View Object
        ModelAndView modelAndView = new ModelAndView();
        //Get Securety Contex Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Get User From DB
        User user = userService.findUserByUserName(auth.getName());
        //Check User Null
        if(user!= null){
            modelAndView.setViewName("quotation.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }


    @RequestMapping(value = "/porder", method = RequestMethod.GET)
    public ModelAndView porderUi() {
        //Create Modal And View Object
        ModelAndView modelAndView = new ModelAndView();
        //Get Securety Contex Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Get User From DB
        User user = userService.findUserByUserName(auth.getName());
        //Check User Null
        if(user!= null){
            modelAndView.setViewName("porder.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/grn", method = RequestMethod.GET)
    public ModelAndView grnUi() {
        //Create Modal And View Object
        ModelAndView modelAndView = new ModelAndView();
        //Get Securety Contex Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Get User From DB
        User user = userService.findUserByUserName(auth.getName());
        //Check User Null
        if(user!= null){
            modelAndView.setViewName("grn.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/product", method = RequestMethod.GET)
    public ModelAndView productUi() {
        //Create Modal And View Object
        ModelAndView modelAndView = new ModelAndView();
        //Get Securety Contex Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Get User From DB
        User user = userService.findUserByUserName(auth.getName());
        //Check User Null
        if(user!= null){
            modelAndView.setViewName("product.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/productcostanalysis", method = RequestMethod.GET)
    public ModelAndView productcostUi() {
        //Create Modal And View Object
        ModelAndView modelAndView = new ModelAndView();
        //Get Securety Contex Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Get User From DB
        User user = userService.findUserByUserName(auth.getName());
        //Check User Null
        if(user!= null){
            modelAndView.setViewName("productcost.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/supplierpayment", method = RequestMethod.GET)
    public ModelAndView supplierpaymentUi() {
        //Create Modal And View Object
        ModelAndView modelAndView = new ModelAndView();
        //Get Securety Contex Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Get User From DB
        User user = userService.findUserByUserName(auth.getName());
        //Check User Null
        if(user!= null){
            modelAndView.setViewName("supplierpayment.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/materialinventory", method = RequestMethod.GET)
    public ModelAndView materialinventoryUi() {
        //Create Modal And View Object
        ModelAndView modelAndView = new ModelAndView();
        //Get Securety Contex Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Get User From DB
        User user = userService.findUserByUserName(auth.getName());
        //Check User Null
        if(user!= null){
            modelAndView.setViewName("materialinventory.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/customerorder", method = RequestMethod.GET)
    public ModelAndView customerorderUi() {
        //Create Modal And View Object
        ModelAndView modelAndView = new ModelAndView();
        //Get Securety Contex Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Get User From DB
        User user = userService.findUserByUserName(auth.getName());
        //Check User Null
        if(user!= null){
            modelAndView.setViewName("customerorder.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/productionorder", method = RequestMethod.GET)
    public ModelAndView produuctionorderUi() {
        //Create Modal And View Object
        ModelAndView modelAndView = new ModelAndView();
        //Get Securety Contex Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Get User From DB
        User user = userService.findUserByUserName(auth.getName());
        //Check User Null
        if(user!= null){
            modelAndView.setViewName("productionorder.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/dailyproduction", method = RequestMethod.GET)
    public ModelAndView dailyproductionUi() {
        //Create Modal And View Object
        ModelAndView modelAndView = new ModelAndView();
        //Get Securety Contex Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Get User From DB
        User user = userService.findUserByUserName(auth.getName());
        //Check User Null
        if(user!= null){
            modelAndView.setViewName("dailyproduction.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/productionordercomfirm", method = RequestMethod.GET)
    public ModelAndView productionordercomfirmUi() {
        //Create Modal And View Object
        ModelAndView modelAndView = new ModelAndView();
        //Get Securety Contex Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Get User From DB
        User user = userService.findUserByUserName(auth.getName());
        //Check User Null
        if(user!= null){
            modelAndView.setViewName("productionordercomfirm.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/delivery", method = RequestMethod.GET)
    public ModelAndView deliveryUi() {
        //Create Modal And View Object
        ModelAndView modelAndView = new ModelAndView();
        //Get Securety Contex Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Get User From DB
        User user = userService.findUserByUserName(auth.getName());
        //Check User Null
        if(user!= null){
            modelAndView.setViewName("delivery.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/customerpayment", method = RequestMethod.GET)
    public ModelAndView customerpaymentUi() {
        //Create Modal And View Object
        ModelAndView modelAndView = new ModelAndView();
        //Get Securety Contex Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Get User From DB
        User user = userService.findUserByUserName(auth.getName());
        //Check User Null
        if(user!= null){
            modelAndView.setViewName("customerpayment.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/producttype", method = RequestMethod.GET)
    public ModelAndView producttypetUi() {
        //Create Modal And View Object
        ModelAndView modelAndView = new ModelAndView();
        //Get Securety Contex Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Get User From DB
        User user = userService.findUserByUserName(auth.getName());
        //Check User Null
        if(user!= null){
            modelAndView.setViewName("producttype.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/printit", method = RequestMethod.GET)
    public ModelAndView WebUi() {
        //Create Modal And View Object
        ModelAndView modelAndView = new ModelAndView();

            modelAndView.setViewName("printitweb.html");

        return modelAndView;
    }

    @RequestMapping(value = "/customerrequests", method = RequestMethod.GET)
    public ModelAndView customerrequestsUI() {
        //Create Modal And View Object
        ModelAndView modelAndView = new ModelAndView();
        //Get Securety Contex Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Get User From DB
        User user = userService.findUserByUserName(auth.getName());
        //Check User Null
        if(user!= null){
            modelAndView.setViewName("custormerrequest.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/customerdeliveryconfirm", method = RequestMethod.GET)
    public ModelAndView customerdeliveryconfirmUI() {
        //Create Modal And View Object
        ModelAndView modelAndView = new ModelAndView();
        //Get Securety Contex Authentication Object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //Get User From DB
        User user = userService.findUserByUserName(auth.getName());
        //Check User Null
        if(user!= null){
            modelAndView.setViewName("customerdeliveryconfirm.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }
}






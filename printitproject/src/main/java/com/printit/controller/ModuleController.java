package com.printit.controller;

import com.printit.model.Module;
import com.printit.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/module")
public class ModuleController {

    @Autowired // to get a instance
    private ModuleRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Module> gender() {
        return dao.list();
    }

    @GetMapping(value = "/list/unassignedtothisrole", params = {"roleid"}, produces = "application/json")
    public List<Module> modulesnotassignedtotherole(Integer roleid) {
        return dao.listUnassignedToThisRole(roleid);

    }


    @GetMapping(value = "/listbyuser", params = {"userid"}, produces = "application/json")
    public List<Module> listbyuser(@RequestParam("userid")Integer userid) {
        return dao.listbyuser(userid);

    }

}

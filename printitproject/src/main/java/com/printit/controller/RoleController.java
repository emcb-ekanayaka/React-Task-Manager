package com.printit.controller;


import com.printit.model.Role;
import com.printit.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping(value = "/role")
@RestController //To set the class readable
public class RoleController {

    @Autowired // to get a instance
    private RoleRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Role> gender() {
        return dao.list();
    }


}

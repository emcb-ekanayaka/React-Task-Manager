package com.printit.controller;


import com.printit.model.Employeestatus;
import com.printit.repository.EmployeestatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping(value = "/employeestatus")
@RestController //To set the class readable
public class EmployeestatusController {

    @Autowired // to get a instance
    private EmployeestatusRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<Employeestatus> employeestatuses() {
        return dao.list();
    }


}

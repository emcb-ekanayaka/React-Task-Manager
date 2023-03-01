package com.printit.controller;

import com.printit.model.Dtype;
import com.printit.model.Maxproductqty;
import com.printit.repository.DesigntypeRepository;
import com.printit.repository.MaxProductQtyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController //To set the class readable
@RequestMapping(value = "/maxproductqty")
public class MaxProductQtyController {

    @Autowired // to get a instance
    private MaxProductQtyRepository dao;

    //maxproductqty/list
    @GetMapping(value = "/list", produces = "application/json")
    public List<Maxproductqty> maxproductqtylist(){
        return dao.findAll() ;
    }
}

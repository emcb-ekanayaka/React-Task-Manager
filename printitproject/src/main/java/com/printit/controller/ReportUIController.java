package com.printit.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController //To set the class readable
public class ReportUIController {

    @RequestMapping(value = "/reportemployee", method = RequestMethod.GET)
    public ModelAndView reportemployee() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("ui/reportemployee.html");
        return modelAndView;
    }
    @RequestMapping(value = "/samplereport", method = RequestMethod.GET)
    public ModelAndView samplereportUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("ui/samplereport.html");
        return modelAndView;
    }

    @RequestMapping(value = "/reportcustomertype", method = RequestMethod.GET)
    public ModelAndView reportcustomertypeUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/Report/reportcustomerordertype.html");
        return modelAndView;
    }

    // supplier arrest pie chart view service
    @RequestMapping(value = "/reportsupplierarrest", method = RequestMethod.GET)
    public ModelAndView reportsupplierarrestUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/Report/reportsupplierarrest.html");
        return modelAndView;
    }

    // customer type pie chart view service
    @RequestMapping(value = "/reportcustomertypes", method = RequestMethod.GET)
    public ModelAndView reportcustomertypesUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/Report/reportcustomerordertype.html");
        return modelAndView;
    }

    // daily product type bar chart view service
    @RequestMapping(value = "/reportdailyproductqty", method = RequestMethod.GET)
    public ModelAndView reportdailyproductqtyUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/Report/reportdailyproductqty.html");
        return modelAndView;
    }

    // income bar chart view service
    @RequestMapping(value = "/reportincome", method = RequestMethod.GET)
    public ModelAndView reportincomeUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/Report/reportincome.html");
        return modelAndView;
    }

    // expenses bar chart view service
    @RequestMapping(value = "/reportexpenses", method = RequestMethod.GET)
    public ModelAndView reportexpensesUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/Report/reportexpenses.html");
        return modelAndView;
    }

    // profit bar chart view service
    @RequestMapping(value = "/reportprofit", method = RequestMethod.GET)
    public ModelAndView reportprofitUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/Report/reportprofit.html");
        return modelAndView;
    }

    // all product type line chart view service
    @RequestMapping(value = "/reportalldailyproductqty", method = RequestMethod.GET)
    public ModelAndView reportalldailyproductqtyUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("/Report/reportalldailyproductqty.html");
        return modelAndView;
    }

}

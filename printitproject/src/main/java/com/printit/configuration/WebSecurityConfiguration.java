package com.printit.configuration;



import com.printit.service.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private MyUserDetailsService userDetailsService;



    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .userDetailsService(userDetailsService)
                .passwordEncoder(bCryptPasswordEncoder);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
//set services to all
        http.
                authorizeRequests()
                .antMatchers("/").permitAll()
                .antMatchers("/resources/**").permitAll()
                .antMatchers("/printit/**").permitAll()
                .antMatchers("/login").permitAll()
                .antMatchers("/forgotpassword").permitAll()
// set service to only a particular user roll
                .antMatchers("/reportcustomertype/**").hasAnyAuthority("ADMIN","OWNER","MANAGER")
                .antMatchers("/reportsupplierarrest/**").hasAnyAuthority("ADMIN","OWNER","MANAGER")
                .antMatchers("/reportcustomertypes/**").hasAnyAuthority("ADMIN","OWNER","MANAGER")
                .antMatchers("/reportdailyproductqty/**").hasAnyAuthority("ADMIN","OWNER","MANAGER")
                .antMatchers("/reportincome/**").hasAnyAuthority("ADMIN","OWNER","MANAGER")
                .antMatchers("/reportexpenses/**").hasAnyAuthority("ADMIN","OWNER","MANAGER")
                .antMatchers("/reportprofit/**").hasAnyAuthority("ADMIN","OWNER","MANAGER")
                .antMatchers("/reportalldailyproductqty/**").hasAnyAuthority("ADMIN","OWNER","MANAGER")
                .antMatchers("/customer/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","ASSISTANT MANAGER","PRODUCTION MANAGER","CASHIER")
                .antMatchers("/delivery/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","CASHIER","ASSISTANT MANAGER","PRODUCTION MANAGER","PRODUCTION ASSISTAN MANAGER","AGENT")
                .antMatchers("/productdesigntype/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","CASHIER","ASSISTANT MANAGER","PRODUCTION MANAGER","PRODUCTION ASSISTAN MANAGER","DESIGNER")
                .antMatchers("/material/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","CASHIER","ASSISTANT MANAGER","PRODUCTION MANAGER","PRODUCTION ASSISTAN MANAGER","SUPERVISOR")
                .antMatchers("/supplier/**").hasAnyAuthority("ADMIN","OWNER","PRODUCTION MANAGER","PRODUCTION ASSISTAN MANAGER")
                .antMatchers("/quotationrequest/**").hasAnyAuthority("ADMIN","OWNER","PRODUCTION MANAGER","PRODUCTION ASSISTAN MANAGER")
                .antMatchers("/quotation/**").hasAnyAuthority("ADMIN","OWNER","PRODUCTION MANAGER","PRODUCTION ASSISTAN MANAGER")
                .antMatchers("/porder/**").hasAnyAuthority("ADMIN","OWNER","PRODUCTION MANAGER","PRODUCTION ASSISTAN MANAGER")
                .antMatchers("/grn/**").hasAnyAuthority("ADMIN","OWNER","PRODUCTION MANAGER","PRODUCTION ASSISTAN MANAGER")
                .antMatchers("/product/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","CASHIER","ASSISTANT MANAGER","PRODUCTION MANAGER","PRODUCTION ASSISTAN MANAGER","SUPERVISOR","AGENT")
                .antMatchers("/productcostanalysis/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","PRODUCTION MANAGER")
                .antMatchers("/supplierpayment/**").hasAnyAuthority("ADMIN","OWNER","PRODUCTION MANAGER","PRODUCTION ASSISTAN MANAGER")
                .antMatchers("/materialinventory/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","PRODUCTION MANAGER","PRODUCTION ASSISTAN MANAGER","SUPERVISOR","CASHIER")
                .antMatchers("/customerorder/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","ASSISTANT MANAGER","PRODUCTION MANAGER","CASHIER","AGENT")
                .antMatchers("/productionorder/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","ASSISTANT MANAGER","PRODUCTION MANAGER","PRODUCTION ASSISTAN MANAGER","SUPERVISOR","CASHIER")
                .antMatchers("/dailyproduction/**").hasAnyAuthority("ADMIN","OWNER","PRODUCTION MANAGER","PRODUCTION ASSISTAN MANAGER","SUPERVISOR")
                .antMatchers("/productionordercomfirm/**").hasAnyAuthority("ADMIN","OWNER","PRODUCTION MANAGER","PRODUCTION ASSISTAN MANAGER","SUPERVISOR")
             //   .antMatchers("/delivery/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","CASHIER","ASSISTANT MANAGER")
                .antMatchers("/customerpayment/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","ASSISTANT MANAGER","CASHIER")
                .antMatchers("/producttype/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","PRODUCTION MANAGER","DESIGNER","ASSISTANT MANAGER","CASHIER")
                //.antMatchers("/customerdeliveryconfirm/**").hasAnyAuthority()
                .antMatchers("/customerrequests/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","CASHIER","ASSISTANT MANAGER")
                .antMatchers("/user/**","/employee/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","CASHIER","ASSISTANT MANAGER","PRODUCTION MANAGER","PRODUCTION ASSISTAN MANAGER","DESIGNER","SUPERVISOR","AGENT")
                .antMatchers("/mainwindow/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","CASHIER","ASSISTANT MANAGER","PRODUCTION MANAGER","PRODUCTION ASSISTAN MANAGER","SUPERVISOR","DESIGNER","AGENT")
                .antMatchers("/privilage/**").hasAnyAuthority("ADMIN","OWNER","MANAGER","CASHIER","ASSISTANT MANAGER","PRODUCTION MANAGER","PRODUCTION ASSISTAN MANAGER","SUPERVISOR","DESIGNER","AGENT").anyRequest().authenticated()
                .and().csrf().disable().formLogin()
                .loginPage("/login") // Go to login page
                .failureHandler((request, response, exception) -> {
                    //Handle Errors
                    System.out.println(exception.getMessage());
                    System.out.println(response.getStatus());
                    String redirectUrl = new String();
                    if(exception.getMessage() == "User is disabled"){
                        redirectUrl = request.getContextPath() + "/login?error=notactive"; //user disable nam --->in-active nam rederect karanna login?error=notactive
                    }else if(exception.getMessage() == "Bad credentials"){
                        redirectUrl = request.getContextPath() + "/login?error=detailserr"; // bad credentials nam rederect karanna mekata
                    }else if(exception.getMessage() == null){
                        redirectUrl = request.getContextPath() + "/login?error=detailserr";  // user kenk nath nm login?error=detailserr ekata rederect karanna
                    }
                    response.sendRedirect(redirectUrl);
                })
                .defaultSuccessUrl("/mainwindow", true)//Login eka success nam kohetada meka derect wenne
                .usernameParameter("username")//check user name
                .passwordParameter("password")//check password
                .and().logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))  // Logout eka check karanne methanin
                //Access Nath nm Access Denaided karanne methanin
                .logoutSuccessUrl("/login").and().exceptionHandling().accessDeniedPage("/access-denied").and()
                .sessionManagement()
                .invalidSessionUrl("/login")//Access Nath nm Access Denaided karanne methanin login page ekata thallu karanwa
                .sessionFixation()
                .changeSessionId()
                // maximum sessions ganana methanin set karala thiyenne
                .maximumSessions(6)
                .expiredUrl("/login").maxSessionsPreventsLogin(true); // expeire unama login page ekata thallu karnwa
        ;
        http.headers()
                .addHeaderWriter(new XFrameOptionsHeaderWriter(XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN));
    }
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        return bCryptPasswordEncoder;
    }
/*    @Bean
    public ViewResolver internalResourceViewResolver() {
        InternalResourceViewResolver bean = new InternalResourceViewResolver();
        bean.setPrefix("/resources/**");
        bean.setSuffix(".html");
        return bean;
    }*/

}

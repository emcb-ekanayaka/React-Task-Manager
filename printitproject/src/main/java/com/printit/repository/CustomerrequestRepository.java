package com.printit.repository;

import com.printit.model.Customerrequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

//JPArepo interface has many function, that's why we and import and use it as extends
public interface CustomerrequestRepository extends JpaRepository <Customerrequest, Integer> {

    @Query("select cr from Customerrequest cr where(cr.fullname like concat('%',:searchtext,'%') or " +
            "cr.email like concat('%',:searchtext,'%') or concat(cr.addeddate,'') like concat('%',:searchtext,'%') or " +
            " concat(cr.requiredate,'') like concat('%',:searchtext,'%') or " +
            "cr.contactnumber like concat('%',:searchtext,'%') or cr.cusrequeststatus_id.name like concat('%',:searchtext,'%'))")
    Page<Customerrequest> findAll(@Param("searchtext") String searchtext, Pageable of);
}

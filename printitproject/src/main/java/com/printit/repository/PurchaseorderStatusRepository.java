package com.printit.repository;

import com.printit.model.Porderstatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseorderStatusRepository extends JpaRepository<Porderstatus, Integer> {
}

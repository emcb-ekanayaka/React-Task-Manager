package com.printit.repository;

import com.printit.model.Quotationstatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuotationStatusRepository extends JpaRepository<Quotationstatus, Integer> {
}

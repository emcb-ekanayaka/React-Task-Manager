package com.printit.repository;

import com.printit.model.Productstatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductStatusRepository extends JpaRepository<Productstatus, Integer> {
}

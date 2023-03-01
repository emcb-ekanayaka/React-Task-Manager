package com.printit.repository;

import com.printit.model.Customerstatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerstatusRepository extends JpaRepository<Customerstatus, Integer> {
}

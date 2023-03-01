package com.printit.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;


@Entity
@Table(name = "quotationrequest_has_material")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuotationRequestHasMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @Basic(optional = false)
    private Integer id;

    @JoinColumn(name = "quotationrequest_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    @JsonIgnore
    private Quotationrequest quotationrequest_id;

    @JoinColumn(name = "material_id", referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Material material_id;

    @Column(name = "requested")
    @Basic(optional = true) // notnull
    private Boolean requested;

    @Column(name = "received")
    @Basic(optional = true) // notnull
    private Boolean received;
}


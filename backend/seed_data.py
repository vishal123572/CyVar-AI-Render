from database.connection import SessionLocal

from models.business_service import BusinessService
from models.asset import Asset
from models.security_control import SecurityControl


db = SessionLocal()


try:
    # Prevent duplicate seeding
    if db.query(BusinessService).count() > 0:
        print("Demo data already exists. Nothing added.")
        raise SystemExit


    # -----------------------------
    # BUSINESS SERVICES
    # -----------------------------

    payments = BusinessService(
        service_code="BS-PAY-001",
        name="Online Payments",
        business_unit="Digital Banking",
        criticality=5,
        revenue_per_hour=300000,
        max_tolerable_downtime=2
    )

    authentication = BusinessService(
        service_code="BS-AUTH-001",
        name="Customer Authentication",
        business_unit="Identity & Access",
        criticality=5,
        revenue_per_hour=200000,
        max_tolerable_downtime=1
    )

    mobile_banking = BusinessService(
        service_code="BS-MOB-001",
        name="Mobile Banking",
        business_unit="Digital Banking",
        criticality=5,
        revenue_per_hour=250000,
        max_tolerable_downtime=2
    )


    db.add_all([
        payments,
        authentication,
        mobile_banking
    ])

    db.commit()


    db.refresh(payments)
    db.refresh(authentication)
    db.refresh(mobile_banking)


    # -----------------------------
    # ASSETS
    # -----------------------------

    payment_api = Asset(
        asset_code="PAY-API-001",
        name="Payment Gateway API",
        asset_type="Web Application",
        business_unit="Digital Banking",
        business_service_id=payments.id,
        criticality=5,
        internet_exposed=True,
        data_classification="Restricted",
        environment="Production"
    )

    payment_db = Asset(
        asset_code="PAY-DB-001",
        name="Payment Transaction Database",
        asset_type="Database",
        business_unit="Digital Banking",
        business_service_id=payments.id,
        criticality=5,
        internet_exposed=False,
        data_classification="Restricted",
        environment="Production"
    )

    identity_server = Asset(
        asset_code="IAM-001",
        name="Identity Server",
        asset_type="Identity",
        business_unit="Identity & Access",
        business_service_id=authentication.id,
        criticality=5,
        internet_exposed=True,
        data_classification="Restricted",
        environment="Production"
    )

    customer_db = Asset(
        asset_code="CUST-DB-001",
        name="Customer Database",
        asset_type="Database",
        business_unit="Digital Banking",
        business_service_id=mobile_banking.id,
        criticality=5,
        internet_exposed=False,
        data_classification="Restricted",
        environment="Production"
    )

    mobile_api = Asset(
        asset_code="MOB-API-001",
        name="Mobile Banking API",
        asset_type="API",
        business_unit="Digital Banking",
        business_service_id=mobile_banking.id,
        criticality=5,
        internet_exposed=True,
        data_classification="Confidential",
        environment="Production"
    )

    web_server = Asset(
        asset_code="WEB-001",
        name="Internet Banking Web Server",
        asset_type="Web Server",
        business_unit="Digital Banking",
        business_service_id=mobile_banking.id,
        criticality=4,
        internet_exposed=True,
        data_classification="Confidential",
        environment="Production"
    )


    db.add_all([
        payment_api,
        payment_db,
        identity_server,
        customer_db,
        mobile_api,
        web_server
    ])

    db.commit()


    for asset in [
        payment_api,
        payment_db,
        identity_server,
        customer_db,
        mobile_api,
        web_server
    ]:
        db.refresh(asset)


    # -----------------------------
    # SECURITY CONTROLS
    # -----------------------------

    controls = [

        SecurityControl(
            asset_id=payment_api.id,
            control_name="Web Application Firewall",
            control_type="Preventive",
            implemented=True,
            effectiveness=0.75,
            annual_cost=600000,
            framework_reference="NIST PR"
        ),

        SecurityControl(
            asset_id=payment_api.id,
            control_name="Endpoint Detection and Response",
            control_type="Detective",
            implemented=True,
            effectiveness=0.80,
            annual_cost=450000,
            framework_reference="NIST DE"
        ),

        SecurityControl(
            asset_id=identity_server.id,
            control_name="Multi-Factor Authentication",
            control_type="Preventive",
            implemented=True,
            effectiveness=0.85,
            annual_cost=350000,
            framework_reference="NIST PR"
        ),

        SecurityControl(
            asset_id=identity_server.id,
            control_name="Privileged Access Management",
            control_type="Preventive",
            implemented=False,
            effectiveness=0.0,
            annual_cost=700000,
            framework_reference="NIST PR"
        ),

        SecurityControl(
            asset_id=customer_db.id,
            control_name="Database Encryption",
            control_type="Preventive",
            implemented=True,
            effectiveness=0.90,
            annual_cost=300000,
            framework_reference="NIST PR"
        ),

        SecurityControl(
            asset_id=mobile_api.id,
            control_name="API Gateway Protection",
            control_type="Preventive",
            implemented=True,
            effectiveness=0.70,
            annual_cost=500000,
            framework_reference="NIST PR"
        ),

        SecurityControl(
            asset_id=web_server.id,
            control_name="Patch Management",
            control_type="Preventive",
            implemented=False,
            effectiveness=0.0,
            annual_cost=250000,
            framework_reference="NIST PR"
        )
    ]


    db.add_all(controls)

    db.commit()

    print("CyVar synthetic enterprise dataset created successfully!")
    print("Business services: 3")
    print("Assets: 6")
    print("Security controls: 7")


finally:
    db.close()
--
-- PostgreSQL database dump
--

\restrict 8OH2gFK64YgqrNzLRDAIdNi4R1Yv01bEgR5kjvCqVsbvrxyiNJ49Ma3XwWbF2jE

-- Dumped from database version 17.11
-- Dumped by pg_dump version 17.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: assets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assets (
    id integer NOT NULL,
    asset_code character varying NOT NULL,
    name character varying NOT NULL,
    asset_type character varying NOT NULL,
    business_unit character varying NOT NULL,
    business_service_id integer NOT NULL,
    criticality integer NOT NULL,
    internet_exposed boolean,
    data_classification character varying NOT NULL,
    environment character varying
);


--
-- Name: assets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.assets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: assets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.assets_id_seq OWNED BY public.assets.id;


--
-- Name: business_services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.business_services (
    id integer NOT NULL,
    service_code character varying NOT NULL,
    name character varying NOT NULL,
    business_unit character varying NOT NULL,
    criticality integer NOT NULL,
    revenue_per_hour double precision,
    max_tolerable_downtime double precision
);


--
-- Name: business_services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.business_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: business_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.business_services_id_seq OWNED BY public.business_services.id;


--
-- Name: security_controls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.security_controls (
    id integer NOT NULL,
    asset_id integer NOT NULL,
    control_name character varying NOT NULL,
    control_type character varying NOT NULL,
    implemented boolean,
    effectiveness double precision,
    annual_cost double precision,
    framework_reference character varying
);


--
-- Name: security_controls_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.security_controls_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: security_controls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.security_controls_id_seq OWNED BY public.security_controls.id;


--
-- Name: software_inventory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.software_inventory (
    id integer NOT NULL,
    asset_id integer NOT NULL,
    vendor character varying NOT NULL,
    product character varying NOT NULL,
    version character varying NOT NULL,
    cpe character varying
);


--
-- Name: software_inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.software_inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: software_inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.software_inventory_id_seq OWNED BY public.software_inventory.id;


--
-- Name: vulnerabilities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vulnerabilities (
    id integer NOT NULL,
    asset_id integer NOT NULL,
    cve_id character varying NOT NULL,
    description character varying,
    cvss_score double precision,
    cvss_severity character varying,
    epss_score double precision,
    epss_percentile double precision,
    cisa_kev boolean,
    patch_status character varying
);


--
-- Name: vulnerabilities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vulnerabilities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: vulnerabilities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vulnerabilities_id_seq OWNED BY public.vulnerabilities.id;


--
-- Name: assets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assets ALTER COLUMN id SET DEFAULT nextval('public.assets_id_seq'::regclass);


--
-- Name: business_services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_services ALTER COLUMN id SET DEFAULT nextval('public.business_services_id_seq'::regclass);


--
-- Name: security_controls id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_controls ALTER COLUMN id SET DEFAULT nextval('public.security_controls_id_seq'::regclass);


--
-- Name: software_inventory id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.software_inventory ALTER COLUMN id SET DEFAULT nextval('public.software_inventory_id_seq'::regclass);


--
-- Name: vulnerabilities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vulnerabilities ALTER COLUMN id SET DEFAULT nextval('public.vulnerabilities_id_seq'::regclass);


--
-- Data for Name: assets; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.assets (id, asset_code, name, asset_type, business_unit, business_service_id, criticality, internet_exposed, data_classification, environment) FROM stdin;
1	PAY-API-001	Payment Gateway API	Web Application	Digital Banking	1	5	t	Restricted	Production
2	PAY-DB-001	Payment Transaction Database	Database	Digital Banking	1	5	f	Restricted	Production
3	IAM-001	Identity Server	Identity	Identity & Access	2	5	t	Restricted	Production
4	CUST-DB-001	Customer Database	Database	Digital Banking	3	5	f	Restricted	Production
5	MOB-API-001	Mobile Banking API	API	Digital Banking	3	5	t	Confidential	Production
6	WEB-001	Internet Banking Web Server	Web Server	Digital Banking	3	4	t	Confidential	Production
\.


--
-- Data for Name: business_services; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.business_services (id, service_code, name, business_unit, criticality, revenue_per_hour, max_tolerable_downtime) FROM stdin;
1	BS-PAY-001	Online Payments	Digital Banking	5	300000	2
2	BS-AUTH-001	Customer Authentication	Identity & Access	5	200000	1
3	BS-MOB-001	Mobile Banking	Digital Banking	5	250000	2
\.


--
-- Data for Name: security_controls; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.security_controls (id, asset_id, control_name, control_type, implemented, effectiveness, annual_cost, framework_reference) FROM stdin;
1	1	Web Application Firewall	Preventive	t	0.75	600000	NIST PR
2	1	Endpoint Detection and Response	Detective	t	0.8	450000	NIST DE
3	3	Multi-Factor Authentication	Preventive	t	0.85	350000	NIST PR
4	3	Privileged Access Management	Preventive	f	0	700000	NIST PR
5	4	Database Encryption	Preventive	t	0.9	300000	NIST PR
6	5	API Gateway Protection	Preventive	t	0.7	500000	NIST PR
7	6	Patch Management	Preventive	f	0	250000	NIST PR
\.


--
-- Data for Name: software_inventory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.software_inventory (id, asset_id, vendor, product, version, cpe) FROM stdin;
1	1	Apache	Log4j	2.14.1	cpe:2.3:a:apache:log4j:2.14.1:*:*:*:*:*:*:*
2	1	Python	FastAPI	Demo	\N
3	3	Keycloak	Keycloak	Demo	\N
4	6	Apache	HTTP Server	Demo	\N
5	2	PostgreSQL	PostgreSQL	16.4	cpe:2.3:a:postgresql:postgresql:16.4:*:*:*:*:*:*:*
6	3	Red Hat	Keycloak	13.0.0	cpe:2.3:a:redhat:keycloak:13.0.0:*:*:*:*:*:*:*
7	4	PostgreSQL	PostgreSQL	15.8	cpe:2.3:a:postgresql:postgresql:15.8:*:*:*:*:*:*:*
8	5	VMware	Spring Framework	5.3.17	cpe:2.3:a:vmware:spring_framework:5.3.17:*:*:*:*:*:*:*
9	6	Apache	HTTP Server	2.4.50	cpe:2.3:a:apache:http_server:2.4.50:*:*:*:*:*:*:*
\.


--
-- Data for Name: vulnerabilities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vulnerabilities (id, asset_id, cve_id, description, cvss_score, cvss_severity, epss_score, epss_percentile, cisa_kev, patch_status) FROM stdin;
1	1	CVE-2021-44228	Apache Log4j2 2.0-beta9 through 2.15.0 (excluding security releases 2.12.2, 2.12.3, and 2.3.1) JNDI features used in configuration, log messages, and parameters do not protect against attacker controlled LDAP and other JNDI related endpoints. An attacker who can control log messages or log message parameters can execute arbitrary code loaded from LDAP servers when message lookup substitution is enabled. From log4j 2.15.0, this behavior has been disabled by default. From version 2.16.0 (along with 2.12.2, 2.12.3, and 2.3.1), this functionality has been completely removed. Note that this vulnerability is specific to log4j-core and does not affect log4net, log4cxx, or other Apache Logging Services projects.	10	CRITICAL	0.99999	1	t	Open
2	2	CVE-2024-10979	Incorrect control of environment variables in PostgreSQL PL/Perl allows an unprivileged database user to change sensitive process environment variables (e.g. PATH).  That often suffices to enable arbitrary code execution, even if the attacker lacks a database server operating system user.  Versions before PostgreSQL 17.1, 16.5, 15.9, 14.14, 13.17, and 12.21 are affected.	8.8	HIGH	0.04393	0.9098	f	Open
3	3	CVE-2021-20222	A flaw was found in keycloak. The new account console in keycloak can allow malicious code to be executed using the referrer URL. The highest threat from this vulnerability is to data confidentiality and integrity as well as system availability.	7.5	HIGH	0.0119	0.66741	f	Open
4	4	CVE-2024-10979	Incorrect control of environment variables in PostgreSQL PL/Perl allows an unprivileged database user to change sensitive process environment variables (e.g. PATH).  That often suffices to enable arbitrary code execution, even if the attacker lacks a database server operating system user.  Versions before PostgreSQL 17.1, 16.5, 15.9, 14.14, 13.17, and 12.21 are affected.	8.8	HIGH	0.04393	0.9098	f	Open
5	5	CVE-2022-22965	A Spring MVC or Spring WebFlux application running on JDK 9+ may be vulnerable to remote code execution (RCE) via data binding. The specific exploit requires the application to run on Tomcat as a WAR deployment. If the application is deployed as a Spring Boot executable jar, i.e. the default, it is not vulnerable to the exploit. However, the nature of the vulnerability is more general, and there may be other ways to exploit it.	9.8	CRITICAL	0.99638	0.99948	t	Open
6	6	CVE-2021-42013	It was found that the fix for CVE-2021-41773 in Apache HTTP Server 2.4.50 was insufficient. An attacker could use a path traversal attack to map URLs to files outside the directories configured by Alias-like directives. If files outside of these directories are not protected by the usual default configuration "require all denied", these requests can succeed. If CGI scripts are also enabled for these aliased pathes, this could allow for remote code execution. This issue only affects Apache 2.4.49 and Apache 2.4.50 and not earlier versions.	9.8	CRITICAL	0.99964	0.99976	t	Open
\.


--
-- Name: assets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.assets_id_seq', 6, true);


--
-- Name: business_services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.business_services_id_seq', 3, true);


--
-- Name: security_controls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.security_controls_id_seq', 7, true);


--
-- Name: software_inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.software_inventory_id_seq', 9, true);


--
-- Name: vulnerabilities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.vulnerabilities_id_seq', 6, true);


--
-- Name: assets assets_asset_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_asset_code_key UNIQUE (asset_code);


--
-- Name: assets assets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (id);


--
-- Name: business_services business_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_services
    ADD CONSTRAINT business_services_pkey PRIMARY KEY (id);


--
-- Name: business_services business_services_service_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_services
    ADD CONSTRAINT business_services_service_code_key UNIQUE (service_code);


--
-- Name: security_controls security_controls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_controls
    ADD CONSTRAINT security_controls_pkey PRIMARY KEY (id);


--
-- Name: software_inventory software_inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.software_inventory
    ADD CONSTRAINT software_inventory_pkey PRIMARY KEY (id);


--
-- Name: vulnerabilities vulnerabilities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vulnerabilities
    ADD CONSTRAINT vulnerabilities_pkey PRIMARY KEY (id);


--
-- Name: ix_assets_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_assets_id ON public.assets USING btree (id);


--
-- Name: ix_business_services_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_business_services_id ON public.business_services USING btree (id);


--
-- Name: ix_security_controls_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_security_controls_id ON public.security_controls USING btree (id);


--
-- Name: ix_software_inventory_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_software_inventory_id ON public.software_inventory USING btree (id);


--
-- Name: ix_vulnerabilities_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_vulnerabilities_id ON public.vulnerabilities USING btree (id);


--
-- Name: assets assets_business_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_business_service_id_fkey FOREIGN KEY (business_service_id) REFERENCES public.business_services(id);


--
-- Name: security_controls security_controls_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_controls
    ADD CONSTRAINT security_controls_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(id);


--
-- Name: software_inventory software_inventory_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.software_inventory
    ADD CONSTRAINT software_inventory_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(id);


--
-- Name: vulnerabilities vulnerabilities_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vulnerabilities
    ADD CONSTRAINT vulnerabilities_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 8OH2gFK64YgqrNzLRDAIdNi4R1Yv01bEgR5kjvCqVsbvrxyiNJ49Ma3XwWbF2jE


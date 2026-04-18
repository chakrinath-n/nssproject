CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,

  title VARCHAR(255) NOT NULL,

  link TEXT,

  category VARCHAR(100) DEFAULT 'General',

  file VARCHAR(255),

  is_scrolling BOOLEAN DEFAULT FALSE,

  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  caption TEXT,
  section VARCHAR(100),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE nss_units (
  id SERIAL PRIMARY KEY,
  district VARCHAR(100) NOT NULL,
  nss_unit_code VARCHAR(20) UNIQUE NOT NULL,
  college_code VARCHAR(20),
  college_name TEXT NOT NULL,
  unit_type VARCHAR(50),
  programme_officer TEXT,
  adopted_village TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE nss_units
ADD COLUMN officer_email VARCHAR(150);
ALTER TABLE nss_units
ADD COLUMN state VARCHAR(100),
ADD COLUMN block VARCHAR(100),
ADD COLUMN university_name TEXT,
ADD COLUMN governing_body VARCHAR(100),
ADD COLUMN courses_offered TEXT,
ADD COLUMN college_type VARCHAR(50),
ADD COLUMN college_address TEXT,
ADD COLUMN college_phone VARCHAR(30),
ADD COLUMN college_email VARCHAR(150);


CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  activity_name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  activity_type VARCHAR(50), -- Regular / Special Camp / Suggestive
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'admin';

CREATE TABLE pages (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  content TEXT,
  status VARCHAR(20) CHECK (status IN ('Published', 'Draft')) DEFAULT 'Draft',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menus (
  id SERIAL PRIMARY KEY,
  menu_name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(20) CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  report_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  file_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(50) CHECK (role IN ('Super Admin', 'Admin')) DEFAULT 'Admin',
  status VARCHAR(20) CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE about (
  id SERIAL PRIMARY KEY,
  title TEXT,
  content TEXT
);
CREATE TABLE nss_team (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  designation VARCHAR(150) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE program_officers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  unit_id INTEGER REFERENCES nss_units(id),
  phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE program_officers
ADD COLUMN gender VARCHAR(20),
ADD COLUMN aadhaar VARCHAR(20),
ADD COLUMN blood_group VARCHAR(10),
ADD COLUMN teaching_subject VARCHAR(100),
ADD COLUMN experience VARCHAR(50),
ADD COLUMN eti_status VARCHAR(20);

CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  activity_name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  activity_type VARCHAR(50),
  unit_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE activities
ADD COLUMN activity_type_id INTEGER,
ADD COLUMN event_date DATE,
ADD COLUMN volunteers_count INTEGER,
ADD COLUMN location TEXT;
ALTER TABLE activities
ADD COLUMN end_date DATE,
ADD COLUMN photo1 TEXT,
ADD COLUMN photo2 TEXT,
ADD COLUMN photo3 TEXT;

CREATE TABLE volunteers (

id SERIAL PRIMARY KEY,

hallticket_no VARCHAR(30),
student_name TEXT,
dob DATE,

course TEXT,
year INTEGER,
semester INTEGER,

gender VARCHAR(10),
category VARCHAR(30),

contact_number VARCHAR(15),
blood_group VARCHAR(10),

email TEXT,
photo TEXT,

aadhaar_number VARCHAR(20),

date_of_join DATE,
nss_group_number VARCHAR(20),

father_name TEXT,
father_occupation TEXT,

address TEXT,
permanent_address TEXT,

willing_donate_blood BOOLEAN,

entry_date DATE,

unit_id INTEGER REFERENCES nss_units(id),

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE activity_types (
 id SERIAL PRIMARY KEY,
 name VARCHAR(150) NOT NULL
);
INSERT INTO activity_types (name) VALUES
('Blood Donation'),
('Plantation of Saplings'),
('Pulse Polio Campaign'),
('Water Harvesting Pits'),
('Swachh Bharat'),
('Pre-Republic Day'),
('Other Activity');


CREATE TABLE special_camps (
  id SERIAL PRIMARY KEY,
  nss_unit_code VARCHAR(50),
  event_type VARCHAR(100) DEFAULT 'Special Camps',
  title VARCHAR(200) NOT NULL,
  event_start_date DATE NOT NULL,
  event_end_date DATE NOT NULL,
  male_volunteers INTEGER DEFAULT 0,
  female_volunteers INTEGER DEFAULT 0,
  description TEXT,
  photo1 TEXT,
  photo2 TEXT,
  photo3 TEXT,
  photo4 TEXT,
  news_clipping1 TEXT,
  news_clipping2 TEXT,
  unit_id INTEGER REFERENCES nss_units(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE social_links (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER UNIQUE REFERENCES nss_units(id),
  twitter VARCHAR(255),
  facebook VARCHAR(255),
  instagram VARCHAR(255),
  youtube VARCHAR(255),
  snapchat VARCHAR(255),
  linkedin VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE social_links 
ADD COLUMN profile_image TEXT;

CREATE TABLE awards (
  id SERIAL PRIMARY KEY,
  award_year VARCHAR(20) NOT NULL,
  award_type VARCHAR(100) NOT NULL,
  recipient_name VARCHAR(150) NOT NULL,
  college_name TEXT NOT NULL,
  district VARCHAR(100),
  photo TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
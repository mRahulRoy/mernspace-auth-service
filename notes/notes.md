##To Generate a migration File

> npm run migration:create ./src/migration/add_refreshtoken_cascade

##To Run Postgress Container

> docker mernPg db container run cmd
> docker run --rm --name mernpg-container -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -v mernpgdata:/var/lib/postgresql/data -p 5432:5432 -d postgres

##To Run Migration

> npm run migration:run -- -d ./src/config/data-source

##To Run Build File

> $env:NODE_ENV = "dev"; node .\src\server.js

### show existing docker images
> docker image ls
docker run --env-file .env.dev -e PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA7Qti7rrSJbsEHTogfgMHC9XazgsNhBqU7R+7gUnMy+/19Ui6
/O9S9VTsW/7lup7l0VB9FWVM5gQiLgidh4V7m+Yi+RiTccjbsdAcMhLsJXTwqmhW
Vm85hq3i85X9fdqQ3EIFgumVaRJ3KnLgx+RPVDB/RY7nPw750cgSSCNgki2Cehnx
qykbqCgS/8cKZ8d1m3Umf0v5peYXtElkPuvH7GHRB6L0mi3kSpKw7rjJ52TrwgtR
QYbL+WRlCbvBQr0ld/7OBL/FCS2PJwZMI1x077u6U4ZSwYUp61ApJX+XUWDuQPqi
KP/jSaRRwtcj6M+MRAsdBXbOZugluUg3agLzkwIDAQABAoIBAA89RELimg0L7QB8
bEdXP+MEzVhuwUbLaksLJB2OCY9ye2A/QncG/QRBs+2MJ+fFPGaMo3LP/IKGV7SY
hpjsvdzwp2UjrW/LJ0VstctWu32clLZX49xFshYuMRRSgb81rhd2KFWMv9EtlNSs
f8/9P3spoDajSjGb75ELKRKGZIVKx2vjFBdeV7U6HjjGwEO+t2SlUiVkDWKKvMcT
OHcclXupfLGJtX2RLh3UB8J5jcPF8CWj+0QtqtmtpCAx1+/VyFBCj6Kp7wxujFa7
Iar6ecNi/4bXv9DtaZlPKDgBLKz4hVZ9TZZCOV04AljDauGLxOwFEaGdGZqeJ9Xr
ZUZXYQECgYEA/yo+2vh0Tum1AD8seYnscdmj5Mu/7VkSK5DfcQ8Ka+n9ZXktZ1dx
K/DLBbgtuafdTPbtvZ3fu9g75ppDigGKQnvS9ah8yn0pqc5H4vTeBp/hhXjEXlJC
j4bSG2y1mrO0/HQ6wc7cwdvMqpNdfsEm113TlhZHXrfQJ3GJamahSJMCgYEA7dH2
DiVzC/j9e0QT7nMKZ7czqG1yyRgGqv8uzDOT3dBs0eMMkBsQDazorjCi867qLxNK
YwP3nej/jbbh9eicDAzVTIagF7UuJ/7bd2L+cY1+5tFoe3BJB6fog/moIe0EsKVw
/8w2ohXxS75MvBgSLowotfB1mECXjjv69BwpiQECgYEAg8YYYdMPlbVCAVeeq0Gc
NwuThVPn0TY/mPofOm7vDd3wO9hBp23UB0I6RsDf9FIJina3PkZqxcKc5LFkEcBL
25vAzZbuo0/SFVxvaXjVtIwa1mgQ2TkYILEajoksnDEUVY/czDv9a6wMXUbvcMdl
PLG61Ha68uJwf/41XhqUTjsCgYB1fjesAYB3N8ozrgySz68iUnZpDbmZ9A7HSE9c
f1bcTW6VuzCnuVcTCoviExFOhuoX29XyWTFqiIRJBUNZdFQz99shdZl+XPqys8zF
jNjcTOWXL3oJEg5ig+fx29Pe/vREOVg8aC3Noj2WCCxs+Q9yg7hROr0+PRsjICr5
kzhKAQKBgALhdkRPIeoidugprnXKvB8d0k10P94eeufkZgQpQsv4VkW98C1zcc//
WWAU8o1UsPXpKr8NXhyp3+NwKv6/YGH4BbPT+qorL+cfGbyMBKuFoWi5R2ubHoTb
Xy1KcgDU5DD7uVrIngXVxMt7oVSupmCXudI48J0xsxVO570k1oB1
-----END RSA PRIVATE KEY-----" -p 5501:5501 mrahulroy/mernstack_auth_service:build-19
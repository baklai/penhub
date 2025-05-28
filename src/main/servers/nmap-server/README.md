# Nmap 7.95SVN ([https://nmap.org](https://nmap.org))

## Usage: nmap [Scan Type(s)] [Options] {target specification}

## TARGET SPECIFICATION:

- Can pass hostnames, IP addresses, networks, etc.
  - Ex: `scanme.nmap.org`, `microsoft.com/24`, `192.168.0.1`, `10.0.0-255.1-254`
- `-iL <inputfilename>`: Input from list of hosts/networks
- `-iR <num hosts>`: Choose random targets
- `--exclude <host1[,host2][,host3],...>`: Exclude hosts/networks
- `--excludefile <exclude_file>`: Exclude list from file

## HOST DISCOVERY:

- `-sL`: List Scan - simply list targets to scan
- `-sn`: Ping Scan - disable port scan
- `-Pn`: Treat all hosts as online -- skip host discovery
- `-PS/PA/PU/PY[portlist]`: TCP SYN, TCP ACK, UDP or SCTP discovery to given ports
- `-PE/PP/PM`: ICMP echo, timestamp, and netmask request discovery probes
- `-PO[protocol list]`: IP Protocol Ping
- `-n/-R`: Never do DNS resolution / Always resolve
- `--dns-servers <serv1[,serv2],...>`: Specify custom DNS servers
- `--system-dns`: Use OS's DNS resolver
- `--traceroute`: Trace hop path to each host

## SCAN TECHNIQUES:

- `-sS/sT/sA/sW/sM`: TCP SYN/Connect()/ACK/Window/Maimon scans
- `-sU`: UDP Scan
- `-sN/sF/sX`: TCP Null, FIN, and Xmas scans
- `--scanflags <flags>`: Customize TCP scan flags
- `-sI <zombie host[:probeport]>`: Idle scan
- `-sY/sZ`: SCTP INIT/COOKIE-ECHO scans
- `-sO`: IP protocol scan
- `-b <FTP relay host>`: FTP bounce scan

## PORT SPECIFICATION AND SCAN ORDER:

- `-p <port ranges>`: Only scan specified ports
  - Ex: `-p22`, `-p1-65535`, `-p U:53,111,137,T:21-25,80,139,8080,S:9`
- `--exclude-ports <port ranges>`: Exclude the specified ports from scanning
- `-F`: Fast mode - Scan fewer ports than the default scan
- `-r`: Scan ports sequentially - don't randomize
- `--top-ports <number>`: Scan <number> most common ports
- `--port-ratio <ratio>`: Scan ports more common than <ratio>

## SERVICE/VERSION DETECTION:

- `-sV`: Probe open ports to determine service/version info
- `--version-intensity <level>`: Set from 0 (light) to 9 (try all probes)
- `--version-light`: Limit to most likely probes (intensity 2)
- `--version-all`: Try every single probe (intensity 9)
- `--version-trace`: Show detailed version scan activity (for debugging)

## SCRIPT SCAN:

- `-sC`: equivalent to `--script=default`
- `--script=<Lua scripts>`: Comma-separated list of directories, script-files, or script-categories
- `--script-args=<n1=v1,[n2=v2,...]>`: Provide arguments to scripts
- `--script-args-file=filename`: Provide NSE script args in a file
- `--script-trace`: Show all data sent and received
- `--script-updatedb`: Update the script database
- `--script-help=<Lua scripts>`: Show help about scripts

## OS DETECTION:

- `-O`: Enable OS detection
- `--osscan-limit`: Limit OS detection to promising targets
- `--osscan-guess`: Guess OS more aggressively

## TIMING AND PERFORMANCE:

- `<time>` values can be in `ms`, `s`, `m`, or `h`
- `-T<0-5>`: Set timing template (higher is faster)
- `--min-hostgroup/max-hostgroup <size>`: Parallel host scan group sizes
- `--min-parallelism/max-parallelism <numprobes>`: Probe parallelization
- `--min-rtt-timeout/max-rtt-timeout/initial-rtt-timeout <time>`: Round trip time settings
- `--max-retries <tries>`: Port scan probe retransmissions
- `--host-timeout <time>`: Timeout per host
- `--scan-delay/--max-scan-delay <time>`: Delay between probes
- `--min-rate <number>`: Minimum send rate
- `--max-rate <number>`: Maximum send rate

## FIREWALL/IDS EVASION AND SPOOFING:

- `-f; --mtu <val>`: Fragment packets (optional MTU)
- `-D <decoy1,decoy2[,ME],...>`: Decoy scan
- `-S <IP_Address>`: Spoof source address
- `-e <iface>`: Use specified interface
- `-g/--source-port <portnum>`: Set source port
- `--proxies <url1,[url2],...>`: Use HTTP/SOCKS4 proxies
- `--data <hex string>` / `--data-string <string>` / `--data-length <num>`: Packet payloads
- `--ip-options <options>`: Send IP options
- `--ttl <val>`: Set IP TTL
- `--spoof-mac <mac>`: MAC address spoofing
- `--badsum`: Send packets with bogus checksum

## OUTPUT:

- `-oN/-oX/-oS/-oG <file>`: Output in Normal, XML, s|<rIpt kIddi3, or Grepable formats
- `-oA <basename>`: Output in all major formats
- `-v`: Increase verbosity (`-vv` for more)
- `-d`: Increase debugging (`-dd` for more)
- `--reason`: Show reason for port state
- `--open`: Show only open (or possibly open) ports
- `--packet-trace`: Trace packets
- `--iflist`: Print host interfaces and routes
- `--append-output`: Append instead of overwrite
- `--resume <filename>`: Resume aborted scan
- `--noninteractive`: Disable runtime keyboard interaction
- `--stylesheet <path/URL>`: XSL for XML output
- `--webxml`: Use Nmap.org stylesheet
- `--no-stylesheet`: No XSL association

## MISC:

- `-6`: Enable IPv6
- `-A`: Enable OS, version, script scan, and traceroute
- `--datadir <dirname>`: Custom data file location
- `--send-eth/--send-ip`: Send with raw ethernet/IP
- `--privileged / --unprivileged`: Privilege assumptions
- `-V`: Show version
- `-h`: Show help

"""Download all Hi-Fi screen screenshots from Stitch project."""
import urllib.request, os, ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "hifi-screenshots")
os.makedirs(OUT, exist_ok=True)

# Screen ID -> filename mapping (all 14 screens)
SCREENS = {
    "1bca19bf286947b3ad859a16c0583d1f": "01_welcome",
    "685ea1a475f644168fe65e7d150a47f0": "02_login",
    "07c2f6e6ceb94e528098f2d9997f6805": "03_player_dashboard",
    "86136b6c6ed0457986d30ac738ae04cf": "04_training_categories",
    "7a437dabb97e4b498aba3dc9b60e4268": "05_speed_detail",
    "36f7a51393f44b53b948cbe1180fdacf": "06_training_progress",
    "55092266d66b4f96bd0a9afce5fa91e6": "07_training_completed",
    "9a9f07e5be874bdba5f100468ce21366": "08_drill_library",
    "4330face98084c5989ff831952e13c10": "09_player_progress",
    "fec56b76b0824c9faa24cc6c2e5721aa": "10_coach_dashboard",
    "20cf59cd4ce1486b856f23512504d4e3": "11_training_calendar",
    "bbdba8c06947429c90a244572c1f84b8": "12_match_preparation",
    "d4c302e4785c4ab09670ef025547c241": "13_profile_settings",
    "0d44168799d1481b9d3b7203280bdf6f": "14_ui_states",
}

# Screenshot URLs from Stitch API
URLS = {
    "01_welcome": "https://lh3.googleusercontent.com/aida/ADBb0uhQI4aqVdxZxAcok5p3A-_rLXO47NTV3_EvatC4qXuRlKHM0fOKbfsSnIXrLTf9US7m54Ql1sElbRvsBGGTbyFFq94d2J8uWp1ZJLyLm5j2Quzgq7tf5AKjrGum45a-e_FL7kgIqxHfKkNkjG_bOiF3jBK20sUp5NZ7Ny4PtjsOUOcTjGV6eE92pKxN3CDRHm__wsOWk8FM6QRRLSLpWxfMJi_lBT2V1e5eSEh-rIHliVKDxgr2K8j2MxM2",
    "02_login": "https://lh3.googleusercontent.com/aida/ADBb0ujWNG18oUGVuvoW3E7VEWCUSfmZr8jytNqeZpeqGnbP0mrfpSh3fLQU77o-i1uzdI-M4u56xOXf1huMzmig0-trOFfp7xVNdP1RmuNsJNqSlFefH6GOq84Yvd6V_6sxjWj6ojhod35OfV4_vpR2_GhFdBBk-dh7Dc3P-miWLxpwkIQutyBbfncyHCk9yFevY2OoR5j3I8fyeA_LM03UpFOwHJhAOpZCut2F3HTx7CAEArgXCUh7U5pfFfg",
    "03_player_dashboard": "https://lh3.googleusercontent.com/aida/ADBb0ujPqjVtHob0KO2brsRPbb23J7DwkDOU-7z-2Jjf9apYto0PVCm4grzsCxQeqjjlKPDRlGrommcfxAlXFYFeXTNpIpxTDTHq8RQXruR9LEWrvLb9JiVsqTJvabH3p2xneO5lq3uK3_L12ak_6Dor-4rjCpJMT-QQ1rRWOEqxF0znOU6f3VSelcxRs8unTEijtvQMHhm-JtuNEpGwYFhfBIUkFT7w3vgEtKFStfO03rd6SKbNAEoI29M0HISP",
    "04_training_categories": "https://lh3.googleusercontent.com/aida/ADBb0ugGC7p78fH9oI6HedHiVdiqB99aj7ovmH4-paeVTFzsj9kD8EIoh_sgoBVyMKjgC_OQVJLPfztwtWLwW1WQIeK9_VlWKuFfWM4CSxw-SbDUH4KMIx1V0r_Ku_CJ2USV7LCzjD49GBtplnnosGsBWZxVMtOhDyPjqZ071HUofGWnizPNsowBoAVWnsWO4RYmcAXKg5bSZLcudFxfVg6EpIHtgjTbjmZtQdlvt3JjJSjD6sIPLnWPPretdNw8",
    "05_speed_detail": "https://lh3.googleusercontent.com/aida/ADBb0ugVPTBvtMnlTP93dvfrqQF1M7baK7IHEwRQv3KvxWJFfwMnqJXCNgc8PlE-9xo4SNTB5N1ODwVzcGWAcXDqpqIaq44FwEjxca-uqtcHfjD70MwVSEc1urjg_VbwgOuCWJhCUQ-8yI3rl3NWr-QPdlMqObFyVXhCOZabp2s1kOqeDaDAXopztCGj4O8srVRvs7QWz-qUkCZXxostiN-k0nP87qLwth82e-a_ue-X_0g5j1KeF7NGQdsZfIg",
    "06_training_progress": "https://lh3.googleusercontent.com/aida/ADBb0uiFAciuvfF1PAoqRhJAYWVM48wk8q_M0rkgHiac0ydxGgRSkbU_TjWp4oWSwWya3YNc0n44NeW7-7uZRZREDWtHHWVNSjbjWOyDcs9YnGnsA6Ah0HzOIeX7xss4SZ8UdFBlLi5_3o8mChgyQJis-KorgG1GgtaAHfnwgl4qxiUcyyTLDahGtn6hT2innKnsjHEdvv4zZc_u-9QiD8J1cDyC7zK6fOcsRRno_JN8pEDCqMQx_qv_4lTEvyqp",
    "07_training_completed": "https://lh3.googleusercontent.com/aida/ADBb0ujvdCYKDzbVI5AXX8L8BrkRLpV5Ncu91vPH1XkrdaG9Uy7g1mLlehNKan4TTKCMYyLZK5A5NIFJGDNHx-_2ymWTZ3oNgep0vOijVGf71C5WI0l5lfIO6N4ueuz9vi7RWTc06gccDIb1W__6bI6v6fkZKI5o5BxQjbInYAJn5aN3S5y-ClMhL_0szoqr234nnEMmA9Ex9HUXxrvB_g52HC9ZWN0eKHy5nlFuuQ0Cf7M3WMHwX_L5hiPlBVU",
    "08_drill_library": "https://lh3.googleusercontent.com/aida/ADBb0uikLkFtOLKniQIY4cKxAdZMjp3slUowdUf6b7DhEEb-yp00E3kDqJXjfn9CDSEpMcszY905n4573cEsrfX2rP-VaAA49R6XLdiu-J2frHMnYyjdDmcpZtSH9GjIxHyqJ6JbnBXAzKQVTMN94wwJyetfZHNvUUHx1Gant-vZ7qnJhk58D4Rgy8EPHcmVAEzRxZyNQWJ4TzU2y1AN_TSj5qcL__bC0yyjC8p6HYTNGFeuxQqiDZ99ex14j9Q1",
    "09_player_progress": "https://lh3.googleusercontent.com/aida/ADBb0uikqg39j_KPWz9VUh0jvmq9KufPUKPWrhWMjLj64zghb98Do95ZHfIGZO_Du6MgrfTDvV8w53BHeITbMafVMqgillawXsGMV-aIyLZzhs4ktRrb3Ha9PqNIYf7w_mwiRt7uMa7mmsbYppT440s8EC4BQHcga_ptXLMMiBlmPkPrLJoe31Xf2H4h-KA7af82qWBNW0XwvRuBVvekXGuhmaPV2zx7vcJAyLdrV3U1lrNj2ePX_xRLFA7KFF3N",
    "10_coach_dashboard": "https://lh3.googleusercontent.com/aida/ADBb0uiAEPImPnKH53xMGvke3YT54A-OohxfwnvRTk_wQvkaB3JnPIP7Z-Y9xwmtibUYcPCG6PE308a-recMiszMsIbFzQHaXyMnLYDVUz3LUtuIZAoBU-f0pZ5iIPkbbXjj2J1F-7Wswv2l212PneOlh9m7zwFF8jM-y9VrV5X8kEKI0yZXrtfG0I-4tRrQLNFbifrH3Bntoyk7Pt5lQgaRB6mONPnLxLFPfSgntaa-5QqO5xFEdvonVv2G6nHA",
}

downloaded = 0
for name, url in URLS.items():
    path = os.path.join(OUT, f"{name}.png")
    if not os.path.exists(path):
        try:
            urllib.request.urlretrieve(url, path)
            downloaded += 1
            print(f"  Downloaded: {name}")
        except Exception as e:
            print(f"  FAILED: {name} - {e}")
    else:
        print(f"  Exists: {name}")

print(f"\nDone. Downloaded {downloaded} new screenshots to {OUT}")
print(f"Total files: {len(os.listdir(OUT))}")

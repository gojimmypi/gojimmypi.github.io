---
layout: post
title: "Microsoft vcpkg port for wolfSSL"
date: '2024-12-28'
author: gojimmypi
tags:
- Microsoft
- vcpkg
- wolfSSL
---

From [https://github.com/microsoft/vcpkg](https://github.com/microsoft/vcpkg):

> Initially launched in 2016 as a tool for assisting developers in migrating their projects to newer
versions of Visual Studio, vcpkg has evolved into a cross-platform tool used by developers on Windows,
macOS, and Linux. vcpkg has a large collection of open-source libraries and enterprise-ready features
designed to facilitate your development process with support for any build and project systems.
vcpkg is a C++ tool at heart and is written in C++ with scripts in CMake. It is designed from the
ground up to address the unique pain points C/C++ developers experience.

See also [Microsoft Learn vcpkg overview, Getting Started](https://learn.microsoft.com/en-us/vcpkg/get_started/overview)

Suggested in [wolfssl #3226](https://github.com/wolfSSL/wolfssl/issues/3226) and
added in [microsoft/vcpkg #24348](https://github.com/microsoft/vcpkg/pull/24348).

From [wolfSSL INSTALL](https://github.com/wolfSSL/wolfssl/blob/master/INSTALL):

> 16. Building wolfssl - Using vcpkg

> You can download and install wolfssl using the [vcpkg at github.com/Microsoft/vcpkg](https://github.com/Microsoft/vcpkg)

Before running the `bootstrap-vcpkg.sh` script below (which calls [bootstrap.sh](https://github.com/microsoft/vcpkg/blob/master/scripts/bootstrap.sh)), note "vcpkg collects usage data".

"[_You can opt-out of telemetry by re-running the bootstrap-vcpkg script with `-disableMetrics`_](https://github.com/microsoft/vcpkg/blob/7bac26279fc130cfe0935bd9629352ebb972abe2/scripts/bootstrap.sh#L240)"

Also: consider whether a system-wide install is desired. If not,
do not run `./vcpkg integrate install` or remove it using `./vcpkg integrate remove`.
Instead:

- For cmake: `cmake -DCMAKE_TOOLCHAIN_FILE=path/to/vcpkg/scripts/buildsystems/vcpkg.cmake ..`
- For Visual Studio, configure the project to explicitly reference the vcpkg directory without relying on global integration.

```
git clone https://github.com/Microsoft/vcpkg.git
cd vcpkg
./bootstrap-vcpkg.sh -disableMetrics
# OR for Windows
bootstrap-vcpkg.bat

./vcpkg integrate install
./vcpkg install wolfssl
```

See also:

* [microsoft/vcpkg/ports/curl](https://github.com/microsoft/vcpkg/tree/master/ports/curl)
* [microsoft/vcpkg/ports/wolfssl](https://github.com/microsoft/vcpkg/tree/master/ports/wolfssl)
* [microsoft/vcpkg/ports/wolfmqtt](https://github.com/microsoft/vcpkg/tree/master/ports/wolfmqtt)
* [microsoft/vcpkg/ports/wolftpm](https://github.com/microsoft/vcpkg/tree/master/ports/wolftpm)
* [microsoft/vcpkg/ports all related wolfSSL Pull Requests](https://github.com/microsoft/vcpkg/pulls?q=is%3Apr+wolfssl+)

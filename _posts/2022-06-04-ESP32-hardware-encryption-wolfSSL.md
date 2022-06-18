---
layout: post
title: "ESP32 Hardware Encryption with wolfSSL"
date: '2022-06-04'
author: gojimmypi
tags:
- SSH
- wolfSSH
- wolfSSL
- ESP32
- Encryption
- Espressif
- SHA256
- HASH
---

PREVIEW, WIP

Here are some notes on the Espressif ESP32 Hardware Encryption Features for wolfSSL.

Any discussion of ESP32 (or any other) hardware encryption should address the generally
non-updatable nature of the implementation. For example, early versions of the ESP32
were discovered by [limitedresults](https://limitedresults.com/) to have 
[explotable hardware vulnerabilities](https://limitedresults.com/2019/08/pwn-the-esp32-crypto-core/).

Hardware vulnerabilities exist across the board, for pretty much all platforms: 
[hertzbleed](https://www.tomshardware.com/news/intel-amd-hertzbleed-cpu-vulnerability-boost-clock-speed-steal-crypto-keys),
[heartbleed](https://www.tomshardware.com/news/stagefright-vulnerability-drm-android-heartbleed,29682.html),
[Spectre](https://www.tomshardware.com/news/intel-amd-spectre-v2-vulnerability-mitigation-bug-fix-patch-cpu-security), etc.

Clearly physical security is just as important as any software design. 

Key to any security implementation is a prompt disclosure and response from the vendor. 
Espressif announced [Security Advisory concerning fault injection and eFuse protections (CVE-2019-17391)](https://www.espressif.com/en/news/Security_Advisory_Concerning_Fault_Injection_and_eFuse_Protections%20)
shortly after "_LimitedResults provided a proof of concept report demonstrating fault injection attack and analysis to recover keys stored in eFuse_".

Note modern ESP32 chip have had a hardware revision to address the fault injection.

> "_The ESP32-D0WD-V3 chip has checks in ROM which prevent fault injection attack_"


## Getting Started

Ensure the user settings header is enabled: define `WOLFSSL_USER_SETTINGS` via `-DWOLFSSL_USER_SETTINGS` in the CMake file at compile time.

wolfssl libraries are typically found in the [components](https://github.com/espressif/esp-idf/tree/master/components) directory 
of either the local project `${CMAKE_HOME_DIRECTORY}` or the ESP-IDF `$ENV{IDF_PATH}` directory.

## Terminology

- `ctx` - context object.
- `HW` hardware encryption method
- `SW` software encryption method


## Hardware Acceleration Overview

There are two useful features of hardware security implemented in the ESP32: Storarage and Computational Acceleration.

There's an ability to [store keys](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/security/secure-boot-v1.html#keys) 
in the [eFuse non-volatile memory](https://www.espressif.com/sites/default/files/documentation/esp32_technical_reference_manual_en.pdf#efuse).

From the [ESP32 Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf), page 12:

![Espressif_Cryptographic_Hardware_Acceleration_Block_Diagram.png](../images/Espressif_Cryptographic_Hardware_Acceleration_Block_Diagram.png)

![Espressif_Cryptographic_Hardware_Acceleration_Block_Diagram.png](../images/Espressif_Cryptographic_Hardware_Acceleration.png)

The interesting files for the wolfSSL hardware encryption for the ESP32 are found in 
the [esp32-crypt.h](https://github.com/wolfSSL/wolfssl/tree/master/wolfssl/wolfcrypt/port/Espressif) 
and [source files](https://github.com/wolfSSL/wolfssl/tree/master/wolfcrypt/src/port/Espressif):

Of particular interest and importance: the Espressif hardware acceleration implementation is NOT RTOS friendly. ONLY ONE hash can be generated at a time.
There is NO mechansim to save an in-porgress computation to let somethine else use the hardware on an interim basis.

One of the concerns might be the encryption used by WiFi. At this time, at least in [ESP-IDF the WiFi crypto functions](https://github.com/espressif/esp-idf/tree/master/components/wpa_supplicant/src/crypto)
are performed in software, such as the [hmac_sha256_vector()](https://github.com/espressif/esp-idf/blob/20f5e180eecccfaff815d707e1fcbba2f4d6a391/components/wpa_supplicant/src/crypto/sha256.c#L26).

Another place of interest regarding the hardware crypto is found in the [esp_rom component](https://github.com/espressif/esp-idf/tree/master/components/esp_rom):

- ESP32 [aes.h](https://github.com/espressif/esp-idf/blob/master/components/esp_rom/include/esp32/rom/aes.h), [rsa_pss.h](https://github.com/espressif/esp-idf/blob/master/components/esp_rom/include/esp32/rom/rsa_pss.h), and [sha.h](https://github.com/espressif/esp-idf/blob/master/components/esp_rom/include/esp32/rom/sha.h), among [others](https://github.com/espressif/esp-idf/tree/master/components/esp_rom/include/esp32/rom).
- ESP32-C2 [aes.h ?], [rsa_pss.h](https://github.com/espressif/esp-idf/blob/master/components/esp_rom/include/esp32c2/rom/rsa_pss.h), and [sha.h](https://github.com/espressif/esp-idf/blob/master/components/esp_rom/include/esp32c2/rom/sha.h), among [others](https://github.com/espressif/esp-idf/tree/master/components/esp_rom/include/esp32c2/rom).
- ESP32-C3 [aes.h](https://github.com/espressif/esp-idf/blob/master/components/esp_rom/include/esp32c3/rom/aes.h), [rsa_pss.h](https://github.com/espressif/esp-idf/blob/master/components/esp_rom/include/esp32c3/rom/rsa_pss.h), and [sha.h](https://github.com/espressif/esp-idf/blob/master/components/esp_rom/include/esp32c3/rom/sha.h), among [others](https://github.com/espressif/esp-idf/tree/master/components/esp_rom/include/esp32c3/rom).
- ESP32-H2 [aes.h](https://github.com/espressif/esp-idf/blob/master/components/esp_rom/include/esp32h2/rom/aes.h), [rsa_pss.h](https://github.com/espressif/esp-idf/blob/master/components/esp_rom/include/esp32h2/rom/rsa_pss.h), and [sha.h](https://github.com/espressif/esp-idf/blob/master/components/esp_rom/include/esp32h2/rom/sha.h), among [others](https://github.com/espressif/esp-idf/tree/master/components/esp_rom/include/esp32h2/rom).
- ESP32-S2 [aes.h](https://github.com/espressif/esp-idf/blob/master/components/esp_rom/include/esp32s2/rom/aes.h), [rsa_pss.h](https://github.com/espressif/esp-idf/blob/master/components/esp_rom/include/esp32s2/rom/rsa_pss.h), and [sha.h](https://github.com/espressif/esp-idf/blob/master/components/esp_rom/include/esp32s2/rom/sha.h), among [others](https://github.com/espressif/esp-idf/tree/master/components/esp_rom/include/esp32s2/rom).
- ESP32-S3 [aes.h](https://github.com/espressif/esp-idf/blob/master/components/esp_rom/include/esp32s2/rom/aes.h), [rsa_pss.h](https://github.com/espressif/esp-idf/blob/master/components/esp_rom/include/esp32s2/rom/rsa_pss.h), and [sha.h](https://github.com/espressif/esp-idf/blob/master/components/esp_rom/include/esp32s2/rom/sha.h), among [others](https://github.com/espressif/esp-idf/tree/master/components/esp_rom/include/esp32s3/rom).

Unfortunately, the implementation seems to be proprietary, as there are only `ld` linker files with [functions assignments to addresses](https://github.com/espressif/esp-idf/blob/20f5e180eecccfaff815d707e1fcbba2f4d6a391/components/esp_rom/esp32/ld/esp32.rom.ld#L1568).
It is assumed the functions in question are _not_ using the hardware acceleration. TODO how to confirm this?

Note that on multicore ESP32 devices, there's a concurrency [warning](https://github.com/espressif/esp-idf/blob/20f5e180eecccfaff815d707e1fcbba2f4d6a391/components/esp_rom/include/esp32/rom/sha.h#L48):

> Do not use these function in multi core mode due to inside they have no safe implementation (without DPORT workaround).

# Reference Documents

The following documents are directly applicable to the cryto-acceleration functions:

- AES (FIPS PUB 197) [esp32_aes.c](https://github.com/wolfSSL/wolfssl/blob/master/wolfcrypt/src/port/Espressif/esp32_aes.c)


<br />

### wolfSSL Fine Tuning

If size is more important the speed, the `USE_SLOW_SHA` can be defined. 
See [sha.c](https://github.com/wolfSSL/wolfssl/blob/8f7db87f01739d51e4b0b3af904ea3a94dff2584/wolfcrypt/src/sha.c#L482) 

> "_nearly 1 K bigger in code size but 25% faster_". 


### wolfSSL ESP32 Hardware Encrpytion

Turn on with `-DWOLFSSL_ESP32WROOM32_CRYPT`. This is enabled by defalt for the ESP32-WROOM. Enables:

- `int esp_sha_process(struct wc_Sha* sha, const byte* data)`
- `int esp_sha_digest_process(struct wc_Sha* sha, byte blockproc)`
- `int esp_sha256_process(struct wc_Sha256* sha, const byte* data)`
- `int esp_sha256_digest_process(struct wc_Sha256* sha, byte blockproc)`

<br />


### SHA Accelerator

See Chapter 23, page 573 of the [ESP32 Technical Reference Manual](https://www.espressif.com/sites/default/files/documentation/esp32_technical_reference_manual_en.pdf)
and [Section 5 of FIPS PUB 180-4 Secure Hash Standard](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf), "SHS".

To disable just SHA acceleration, use `-DNO_WOLFSSL_ESP32WROOM32_CRYPT_HASH`

see [esp32_sha.c](https://github.com/wolfSSL/wolfssl/blob/master/wolfcrypt/src/port/Espressif/esp32_sha.c)

Hash SHA-2 (FIPS PUB 180-4): [esp32_sha.c](https://github.com/wolfSSL/wolfssl/blob/master/wolfcrypt/src/port/Espressif/esp32_sha.c)

given `const byte* V`

```
    byte data[DRBG_SEED_LEN];
    len = (outSz / OUTPUT_BLOCK_LEN) + ((outSz % OUTPUT_BLOCK_LEN) ? 1 : 0);
    XMEMCPY(data, V, sizeof(data));

    for (i = 0; i < len; i++) {
    ret = wc_InitSha256(sha);
        if (ret == 0) {
            ret = wc_Sha256Update(sha, data, sizeof(data));
        }
        if (ret == 0) {
            ret = wc_Sha256Final(sha, digest);
        }
        wc_Sha256Free(sha);
     }
```

To aid in development, it can be helpful to have a [web hash converter](https://hash.online-convert.com/) or desktop SHA-256 calculator.
See [system.security.cryptography.sha256](https://docs.microsoft.com/en-us/dotnet/api/system.security.cryptography.sha256?view=net-6.0):

```
using System;
using System.Security.Cryptography;

namespace mySHA256_calculator
{
    class Program
    {
        public static void PrintByteArray(byte[] array)
        {
            for (int i = 0; i < array.Length; i++)
            {
                Console.Write($"{array[i]:X2}");
                if ((i % 4) == 3) Console.Write(" ");
            }
            Console.WriteLine();
        }

        // 32 words:  45725791 C47B3261 8CC57B88 343E2BCE EC3B0A01 B83BC97D 144A2CBC 11A20C3D
        // 16 words:  60E05BD1 B195AF2F 94112FA7 197A5C88 28905884 0CE7C6DF 9693756B C6250F55
        //  8 words:  84E0C0EA FAA95A34 C293F278 AC52E45C E537BAB5 E752A00E 6959A13A E103B65A
        //
        // 64 zeros (16 words of 4 bytes of "0" = 0x30)
        // 0000000000000000000000000000000000000000000000000000000000000000
        //            60E05BD1 B195AF2F 94112FA7 197A5C88 28905884 0CE7C6DF 9693756B C6250F55
        //
        // "0" = 0x30 (VS)
        // 5FECEB66 FFC86F38 D952786C 6D696C79 C2DBC239 DD4E91B4 6729D73A 27FB57E9
        //
        // 0x30000000
        // 4F8320D9 1E97D546 DC799848 E8D218E1 8050AF7A 7964E041 4DE9E547 9006D7E3

        static void Main(string[] args)
        {
            using (SHA256 mySHA256 = SHA256.Create())
            {
                int word_size = 8;

                byte[] buffer = new byte[word_size * 4];

                int byte_fill = word_size * 4;
                for (int i = 0; i < byte_fill; i++)
                {
                    buffer[i] = 0x30;
                }
                byte[] hashValue = mySHA256.ComputeHash(buffer);
                PrintByteArray(buffer);    // 30303030 30303030 30303030 30303030 30303030 30303030 30303030 30303030
                PrintByteArray(hashValue); // 84E0C0EA FAA95A34 C293F278 AC52E45C E537BAB5 E752A00E 6959A13A E103B65A
                Console.WriteLine("");

                byte[] buffer2 = new byte[4];
                buffer2[0] = 0x30;
                buffer2[1] = 0x00;
                buffer2[2] = 0x00;
                buffer2[3] = 0x00;
                byte[] hashValue2 = mySHA256.ComputeHash(buffer2);

                PrintByteArray(buffer2);    // 30000000
                PrintByteArray(hashValue2); // 4F8320D9 1E97D546 DC799848 E8D218E1 8050AF7A 7964E041 4DE9E547 9006D7E3
            }
        }
    }
}
```

There are some interesting notes about the SHA encryption registers on the ESP32:

- The hash _output_ is found the the same registers used for _input_, both starting at `SHA_TEST_0_REG` at `0x3FF03000`.
- There's only 1 register set for all hash functions: SHA1, SHA256, SHA384, SHA512.
- The intial hash values, (see [SHA-2 pseudcode](https://en.wikipedia.org/wiki/SHA-2), e.g. h0 := 0x6a09e667 in [wolfcrypt sha256.c](https://github.com/wolfSSL/wolfssl/blob/390908bccc5fbe678e3dd0ea43526aca430b27cb/wolfcrypt/src/sha256.c#L710)) _do not_ need to be loaded.
- Once a hash process is started, the interim result is hidden and cannot be stashed to start on a different computation.
- At least one `asm volatile("memw");`  "_should be executed in between every load or store to a volatile variable_" (See Xtensa ISA Reference Manual)
- Repeated calls to `periph_module_enable(PERIPH_SHA_MODULE)` are tracked for recursion. Call to `periph_module_disable` is only effective after [all enables are unwrapped](https://github.com/espressif/esp-idf/blob/5e6cffbb14fa78e6e8475550c1606b29ec1aa7f0/components/driver/periph_ctrl.c#L31).
- A call to `periph_module_reset` will reset the device regardless of how many times `periph_module_enable` was called, and the [call-counter is not reset](https://github.com/espressif/esp-idf/blob/5e6cffbb14fa78e6e8475550c1606b29ec1aa7f0/components/driver/periph_ctrl.c#L37).
- Data must be processed in 512 bit chunks for SHA256 (64 bytes stored in sixteen 4-byte words, starting at `SHA_TEST_0_REG` at `0x3FF03000`)
- The trailing bit "1" _and_ 64-bit has word count _does_ need to be manually applied to the last block as noted on page 18 of [FIPS PUB 180-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf) :

![FIPS180-4_Message_Preprocessing.png](../images/wolfssl/FIPS180-4_Message_Preprocessing.png)

Reminder: The ESP32 SHA encryption accelerator _does not do final padding_. The `0x80` and 64-bit message length need to be manually added! 

Each block of data is hashed into digest for wolfSSL:

![sha_digest_quickwatch.png](../images/wolfssl/sha_digest_quickwatch.png)

Given the single-computation nature of the hardware acclerated hash content registers, not that even in a single-thread RTOS, multiple 
hashes may need to be computed concurrently. This will cause the second one to fall back to software calculations.

For example, in the ESP32 SSH to UART example, the non-blocking call to [wolfSSH_accept](https://github.com/gojimmypi/wolfssh/blob/713c7358501b9107d2e85a2a3f0e296a89a180ad/examples/ESP32-SSH-Server/main/ssh_server.c#L174)
that is [started upon connection](https://github.com/gojimmypi/wolfssh/blob/713c7358501b9107d2e85a2a3f0e296a89a180ad/examples/ESP32-SSH-Server/main/ssh_server.c#L235)


<br />


### RSA Accelerator

See Chapter 24, page 582 of the [ESP32 Technical Reference Manual](https://www.espressif.com/sites/default/files/documentation/esp32_technical_reference_manual_en.pdf)

multiplication: [esp32_mp.c](https://github.com/wolfSSL/wolfssl/blob/master/wolfcrypt/src/port/Espressif/esp32_mp.c)



Turn on with `-DWOLFSSL_ESP32WROOM32_CRYPT_RSA_PRI`. Enables:

> The maximum operation length for RSA, ECC, Big Integer Multiply and Big Integer Modular Multiplication is 4096 bits

Support for large-number modular exponentiation:

- TODO


Support for large-number modular multiplication:

- `int esp_mp_mulmod(fp_int* X, fp_int* Y, fp_int* M, fp_int* Z)`: `Z = X * Y (mod M)` 


Support for large-number multiplication:

- `int esp_mp_mul(fp_int* X, fp_int* Y, fp_int* Z)` 


Support for various lengths of operands:
<br />


### ECC 

*Not* to be confused with the Error Code Capture feature:

> Error Code Capture (ECC) feature allows the TWAI controller to record the error type and bit position of a
TWAI bus error in the form of an error code


> The maximum operation length for RSA, ECC, Big Integer Multiply and Big Integer Modular Multiplication is 4096 bits

- todo
<br />

### RNG Random Number Generator 

- todo

Random number generator table:

| Start Address | End Address | Size |
| ------------- | ----------- | ---- |
| 0x3FF7_5000   | 0x3FF7_5FFF |  4KB |

<br />

### wolfSSL utility library

[util](https://github.com/wolfSSL/wolfssl/blob/master/wolfcrypt/src/port/Espressif/esp32_util.c)
<br />


### Coding Convention

In wolfCrypt those API's return 0 for success.

`WOLFSSL_SUCCESS` and `WOLFSSL_FAILURE` values should only be used in the ssl layer, not in wolfCrypt.

WOLFSSL_SUCCESS and WOLFSSL_FAILURE values should only be used in the ssl layer, not in wolfCrypt
<br />


### Development

Install wolfSSL for WSL:

```bash
cd  /mnt/c/workspace/wolfssl
./configure  --enable-tls13 --prefix=/usr/ && make && sudo make install
# or
./configure --enable-dtls --enable-tls13 --prefix=/usr/ && make && sudo make install
```

DTLS compile:

```
gcc -o server-dtls server-dtls.c -Wall -I/usr/local/include -Os -L/usr/local/lib -lm -lwolfssl  -Wl,-rpath=/usr/local/lib
```

WSL TLS1.3 Server:

```
cd /mnt/c/workspace/wolfssl-examples/tls
 ./server-tls13 -v 4
```
<br />

Resources, Inspiration, Credits, and Other Links:<br />

- wolfSSL [Espressif](https://www.wolfssl.com/Espressif/)
- wolfSSL [docs/Espressif](https://www.wolfssl.com/docs/espressif/)
- wolfSSL [wolfSSL ESP32 Hardware Acceleration Support](https://www.wolfssl.com/wolfssl-esp32-hardware-acceleration-support/)
- wolfSSL [Porting Guide](https://www.wolfssl.com/docs/porting-guide/)
- Espressif [ESP32 Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
- Espressif [ESP32 Technical Reference Manual](https://www.espressif.com/sites/default/files/documentation/esp32_technical_reference_manual_en.pdf)
- Espressif Blog [Understanding ESP32's Security Features](https://blog.espressif.com/understanding-esp32s-security-features-14483e465724)
- Espressif Blog [ESP32: TLS (Transport Layer Security) And IoT Devices](https://blog.espressif.com/esp32-tls-transport-layer-security-and-iot-devices-3ac93511f6d8)
- Espressif Blog [ESP32-S2: Digital Signature Peripheral](https://blog.espressif.com/esp32-s2-digital-signature-peripheral-7e70bf6dde88)
- Espressif GitHub Example [ESP-MQTT SSL Mutual Authentication with Digital Signature](https://github.com/espressif/esp-idf/blob/master/examples/protocols/mqtt/ssl_ds/README.md)
- LimitedResults [Pwn the ESP32 Forever: Flash Encryption and Sec. Boot Keys Extraction](https://limitedresults.com/2019/11/pwn-the-esp32-forever-flash-encryption-and-sec-boot-keys-extraction/)
- wolfSSL [ESP32 Hardware Acceleration Support](https://www.wolfssl.com/wolfssl-esp32-hardware-acceleration-support/)
- wolfSSL [Install](https://github.com/wolfSSL/wolfssl/blob/master/INSTALL)
- Wireshark [capture filters](https://wiki.wireshark.org/CaptureFilters)
- Adafruit [ESP32uesday: The ESP32-S3 is More Than a Fancy S2](https://blog.adafruit.com/2022/05/31/esp32uesday-the-esp32-s3-is-more-than-a-fancy-s2/)
- OpenOCD [Open On-Chip Debugger User Guide](https://openocd.sourceforge.io/doc/pdf/openocd.pdf)
- Stackoverflow [How to debug "cannot open shared object file: No such file or directory"?](https://stackoverflow.com/questions/67753007/how-to-debug-cannot-open-shared-object-file-no-such-file-or-directory/67753144#67753144)
- [Xtensa Instruction Set Architecture (ISA) Reference Manual](http://0x04.net/~mwk/doc/xtensa.pdf)


- [David's comments](https://github.com/wolfSSL/wolfssl/compare/master...dgarske:esp32_sha?expand=1)

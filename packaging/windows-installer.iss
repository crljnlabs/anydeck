; Inno Setup script for anydeck.
;
; Not called directly - scripts/build.py passes the values in:
;   iscc /DAppVersion=1.0.0 /DSourceDir=... /DOutputDir=... /DOutputName=...
;
; Requires Inno Setup 6 (iscc.exe on PATH). If it is missing, the build script
; falls back to the portable .zip.

#define AppName "anydeck"
#define AppPublisher "crljnlabs"
#define AppUrl "https://github.com/crljnlabs/anydeck"

[Setup]
AppId={{8F2C4B3A-1D5E-4A7B-9C6D-ANYDECK000001}
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisher={#AppPublisher}
AppPublisherURL={#AppUrl}
DefaultDirName={autopf}\{#AppName}
DefaultGroupName={#AppName}
OutputDir={#OutputDir}
OutputBaseFilename={#OutputName}
; SourcePath is the directory of this script, so the icon is found regardless
; of where iscc was started from.
SetupIconFile={#SourcePath}\..\assets\icons\anydeck.ico
UninstallDisplayIcon={app}\anydeck.exe
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
; Per-user install, so no administrator rights are needed.
PrivilegesRequired=lowest
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible

[Files]
Source: "{#SourceDir}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\{#AppName}"; Filename: "{app}\anydeck.exe"
Name: "{autodesktop}\{#AppName}"; Filename: "{app}\anydeck.exe"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Additional shortcuts:"
Name: "startup"; Description: "Start {#AppName} when Windows starts"; GroupDescription: "Startup:"

[Registry]
Root: HKCU; Subkey: "Software\Microsoft\Windows\CurrentVersion\Run"; ValueType: string; \
    ValueName: "{#AppName}"; ValueData: """{app}\anydeck.exe"""; Flags: uninsdeletevalue; Tasks: startup

[Run]
Filename: "{app}\anydeck.exe"; Description: "Start {#AppName}"; Flags: nowait postinstall skipifsilent

$file = "c:\Users\ADMIN\scopesintegration\Application-module-F8\src\components\applicationcomponents\application-distribution\DGMComponent\DgmForm.jsx"
$content = Get-Content $file

# New logic for lines 392-398 (1-based in editor, 0-based in array is 391-397)
$newLogic = @(
    "  // Prioritize selected values from the dropdown lists",
    "  const currentCity = cities.find((c) => cityId(c) === selectedCityId);",
    "  if (currentCity) {",
    "    obj.cityName = cityLabel(currentCity);",
    "  } else if (locationData?.cityName && locationData.cityId === selectedCityId) {",
    "    obj.cityName = locationData.cityName;",
    "  } else if (initialValues?.cityName && initialValues.cityId === selectedCityId) {",
    "    obj.cityName = initialValues.cityName;",
    "  }",
    "",
    "  const currentZone = zones.find((z) => zoneId(z) === selectedZoneId);",
    "  if (currentZone) {",
    "    obj.zoneName = zoneLabel(currentZone);",
    "  } else if (locationData?.zoneName && locationData.zoneId === selectedZoneId) {",
    "    obj.zoneName = locationData.zoneName;",
    "  } else if (initialValues?.zoneName && initialValues.zoneId === selectedZoneId) {",
    "    obj.zoneName = initialValues.zoneName;",
    "  }",
    "",
    "  const currentCampus = campuses.find((c) => campusId(c) === selectedCampusId);",
    "  if (currentCampus) {",
    "    obj.campusName = campusLabel(currentCampus);",
    "  } else if (initialValues?.campusName && initialValues.campusId === selectedCampusId) {",
    "    obj.campusName = initialValues.campusName;",
    "  }"
)

# Replace lines 392-398 (indices 391-397)
$pre = $content[0..390]
$post = $content[398..($content.Length - 1)]
$content = $pre + $newLogic + $post

# Update deps.
# Original lines 436-440 (indices 435-439)
# Shift = 24 (new) - 7 (old) = 17.
# New indices: 435 + 17 = 452.
$depsStart = 452
$depsEnd = 456

$newDeps = @(
    "  seriesObj,",
    "  mobileNo,",
    "  locationData,",
    "  initialValues,",
    "  cities,",
    "  zones,",
    "  campuses,",
    "]);"
)

$pre2 = $content[0..($depsStart-1)]
$post2 = $content[($depsEnd+1)..($content.Length - 1)]
$finalContent = $pre2 + $newDeps + $post2

$finalContent | Set-Content $file -Encoding UTF8
Write-Host "Successfully patched DgmForm.jsx"

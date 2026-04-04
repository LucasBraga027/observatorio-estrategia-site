$files = Get-ChildItem -Path images
foreach ($f in $files) {
    if ($f.Name -like "*COLORIDA*") { Rename-Item -Path $f.FullName -NewName "logo-colorida.png" -Force }
    elseif ($f.Name -like "*BRANCA*") { Rename-Item -Path $f.FullName -NewName "logo-branca.png" -Force }
    elseif ($f.Name -like "*COLORIDO*") { Rename-Item -Path $f.FullName -NewName "logo-simbolo-colorido.png" -Force }
    elseif ($f.Name -like "*BRANCO*") { Rename-Item -Path $f.FullName -NewName "logo-simbolo-branco.png" -Force }
    elseif ($f.Name -like "*PRETO (1)*") { Rename-Item -Path $f.FullName -NewName "logo-simbolo-preto-backup.png" -Force }
    elseif ($f.Name -like "*PRETO*") { Rename-Item -Path $f.FullName -NewName "logo-simbolo-preto.png" -Force }
}

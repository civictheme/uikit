rsync -a --delete ../../components/ ../components/

echo "-> Includes before:"
grep --include=*.twig -rnw ../components -e "@\(base\|atoms\|molecules\|organisms\)/.*/.*\.twig" | wc -l | awk '{print $1}'

echo "-> Replace twig includes"
node replace.mjs

echo "-> Includes after:"
grep --include=*.twig -rnw ../components -e "@\(base\|atoms\|molecules\|organisms\)/.*/.*\.twig" | wc -l | awk '{print $1}'

# ----

echo "-> Sync assets:"
rsync -a --delete ../../assets/ ../assets/

# ----

echo "-> Build"
cd ../
npm run dist
cd scripts

# ----

echo "-> Add story import dependencies"
node story-imports.mjs

rsync -a --delete ../../components/ ../components/

echo "-> Includes before:"
grep --include=*.twig -rnw ../components -e "@\(base\|atoms\|molecules\|organisms\)/.*/.*\.twig" | wc -l | awk '{print $1}'

echo "-> Replace twig includes"
node replace.mjs

echo "-> Includes after:"
grep --include=*.twig -rnw ../components -e "@\(base\|atoms\|molecules\|organisms\)/.*/.*\.twig" | wc -l | awk '{print $1}'

# ----

find "../components" -type d -name "__snapshots__" -exec rm -rf {} \;
find "../components" -name "*.test.js" -exec rm -rf {} \;

# ----

echo "-> Build"
cd ../
npm run dist
cd scripts

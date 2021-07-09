const run = async () => {
  const config = await readConfig();
  const diff = await findDiff(config);
  await bumpPackages(diff);
  await npmPublish(diff);
  await commitMessage(config);
};

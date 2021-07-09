
const run = async () => {
    const config = await readConfig();
    const diff = await findDiff(config)
    await npmPublish(diff);
    await commitMessage(config);
}